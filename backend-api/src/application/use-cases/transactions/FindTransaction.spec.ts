jest.mock('uuid', () => ({
  v4: jest.fn(() => 'uuid-fixed'),
}));
import { ProductRepository } from 'src/domain/ports/product.repository';
import { TransactionRepository } from 'src/domain/ports/transaction.repository';
import { FindTransactionWompiService } from 'src/infraestructure/wompi/wompi-transaction.service';
import { FindTransaction } from './FindTransaction';
import { ITransaction } from 'src/domain/entities/Transaction';
import { ITransactionWompi } from 'src/infraestructure/wompi/types/transactions';
import { IProduct } from 'src/domain/entities/Product';

describe('FindTransaction', () => {
  let useCase: FindTransaction;

  let transactionRepo: jest.Mocked<TransactionRepository>;
  let productRepo: jest.Mocked<ProductRepository>;
  let wompiService: jest.Mocked<FindTransactionWompiService>;

  beforeEach(() => {
    transactionRepo = {
      findOne: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    };

    productRepo = {
      findOne: jest.fn(),
      updateQuantity: jest.fn(),
      findAll: jest.fn(),
    };

    wompiService = {
      findTransaction: jest.fn(),
    } as unknown as jest.Mocked<FindTransactionWompiService>;

    useCase = new FindTransaction(transactionRepo, wompiService, productRepo);
  });

  it('should throw error if idTransactionWompi is missing', async () => {
    await expect(
      useCase.execute({
        idTransactionWompi: '',
        idProduct: 'prod-1',
      }),
    ).rejects.toThrow('Missing or wrong idTransactionWompi');
  });

  it('should throw error if idProduct is missing', async () => {
    await expect(
      useCase.execute({
        idTransactionWompi: 'tx-1',
        idProduct: '',
      }),
    ).rejects.toThrow('Missing or wrong idProduct');
  });

  it('should throw error if transaction does not exist', async () => {
    transactionRepo.findOne.mockResolvedValue(undefined);

    await expect(
      useCase.execute({
        idTransactionWompi: 'tx-1',
        idProduct: 'prod-1',
      }),
    ).rejects.toThrow('Transaction not found');
  });

  it('should throw error if transaction does not exist in Wompi', async () => {
    transactionRepo.findOne.mockResolvedValue({} as ITransaction);
    wompiService.findTransaction.mockResolvedValue(
      null as unknown as ITransactionWompi,
    );

    await expect(
      useCase.execute({
        idTransactionWompi: 'tx-1',
        idProduct: 'prod-1',
      }),
    ).rejects.toThrow('Transaction not found in Wompi');
  });

  it('should update transaction and product when status is not PENDING', async () => {
    transactionRepo.findOne.mockResolvedValue({
      idTransaction: '1',
    } as ITransaction);

    wompiService.findTransaction.mockResolvedValue({
      status: 'APPROVED',
      finalized_at: '2025-01-01',
      status_message: 'Approved',
    } as ITransactionWompi);

    transactionRepo.update.mockResolvedValue({
      idTransaction: '1',
      status: 'APPROVED',
    } as ITransaction);

    productRepo.findOne.mockResolvedValue({
      idProduct: 'prod-1',
      quantity: 5,
      name: 'Test Product',
      price: 1000,
    } as IProduct);

    const result = await useCase.execute({
      idTransactionWompi: 'tx-1',
      idProduct: 'prod-1',
    });

    expect(transactionRepo.update).toHaveBeenCalledWith({
      idTransactionWompi: 'tx-1',
      finalizedAt: '2025-01-01',
      status: 'APPROVED',
      statusMessage: 'Approved',
    });

    expect(productRepo.updateQuantity).toHaveBeenCalledWith('prod-1', 4);
    expect(result).toEqual({
      idTransaction: '1',
      status: 'APPROVED',
    });
  });

  it('should throw error if product does not exist', async () => {
    transactionRepo.findOne.mockResolvedValue({} as ITransaction);

    wompiService.findTransaction.mockResolvedValue({
      status: 'DECLINED',
      finalized_at: '2025-01-01',
      status_message: 'Declined',
    } as ITransactionWompi);

    transactionRepo.update.mockResolvedValue({} as ITransaction);
    productRepo.findOne.mockResolvedValue(null as unknown as IProduct);

    await expect(
      useCase.execute({
        idTransactionWompi: 'tx-1',
        idProduct: 'prod-1',
      }),
    ).rejects.toThrow('Product not found');
  });
});
