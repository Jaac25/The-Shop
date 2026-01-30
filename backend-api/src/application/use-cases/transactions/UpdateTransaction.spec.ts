jest.mock('uuid', () => ({
  v4: jest.fn(() => 'uuid-fixed'),
}));
import { FindTransactionWompiService } from 'src/infraestructure/wompi/wompi-transaction.service';
import { TransactionRepository } from 'src/domain/ports/transaction.repository';
import { UpdateTransaction } from './UpdateTransaction';
import { ITransactionWompi } from 'src/infraestructure/wompi/types/transactions';
import { ITransaction } from 'src/domain/entities/Transaction';

describe('UpdateTransaction', () => {
  let useCase: UpdateTransaction;

  let transactionRepo: jest.Mocked<TransactionRepository>;
  let wompiService: jest.Mocked<FindTransactionWompiService>;

  beforeEach(() => {
    transactionRepo = {
      findOne: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    };

    wompiService = {
      findTransaction: jest.fn(),
    } as unknown as jest.Mocked<FindTransactionWompiService>;

    useCase = new UpdateTransaction(transactionRepo, wompiService);
  });

  it('should throw error if id is missing', async () => {
    await expect(useCase.execute({ id: '' })).rejects.toThrow(
      'Missing or wrong id',
    );
  });

  it('should throw error if transaction is not found in Wompi', async () => {
    wompiService.findTransaction.mockResolvedValue(
      null as unknown as ITransactionWompi,
    );

    await expect(useCase.execute({ id: 'tx-1' })).rejects.toThrow(
      'Transaction not found',
    );
  });

  it('should update transaction using wompi data', async () => {
    wompiService.findTransaction.mockResolvedValue({
      status: 'APPROVED',
      finalized_at: '2025-01-10',
      status_message: 'Approved',
    } as ITransactionWompi);

    transactionRepo.findOne.mockResolvedValue({
      id: '1',
      status: 'APPROVED',
    } as unknown as ITransaction);

    const result = await useCase.execute({ id: 'tx-1' });

    expect(transactionRepo.update).toHaveBeenCalledWith({
      idTransactionWompi: 'tx-1',
      finalizedAt: '2025-01-10',
      status: 'APPROVED',
      statusMessage: 'Approved',
    });

    expect(transactionRepo.findOne).toHaveBeenCalledWith('tx-1');
    expect(result).toEqual({
      id: '1',
      status: 'APPROVED',
    });
  });

  it('should return undefined if repository returns no transaction after update', async () => {
    wompiService.findTransaction.mockResolvedValue({
      status: 'DECLINED',
      finalized_at: '2025-01-10',
      status_message: 'Declined',
    } as ITransactionWompi);

    transactionRepo.findOne.mockResolvedValue(undefined);

    const result = await useCase.execute({ id: 'tx-1' });

    expect(transactionRepo.update).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
