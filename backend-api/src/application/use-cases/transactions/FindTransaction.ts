import { Inject, Injectable } from '@nestjs/common';
import { ITransaction } from 'src/domain/entities/Transaction';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from 'src/domain/ports/product.repository';
import type { TransactionRepository } from 'src/domain/ports/transaction.repository';
import { TRANSACTION_REPOSITORY } from 'src/domain/ports/transaction.repository';
import { FindTransactionWompiService } from 'src/infraestructure/wompi/wompi-transaction.service';

@Injectable()
export class FindTransaction {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repo: TransactionRepository,
    private readonly wompi: FindTransactionWompiService,
    @Inject(PRODUCT_REPOSITORY)
    private readonly product: ProductRepository,
  ) {}

  async execute({
    idTransactionWompi,
    idProduct,
  }: {
    idTransactionWompi: string;
    idProduct: string;
  }): Promise<ITransaction | undefined> {
    if (!idTransactionWompi) {
      throw new Error('Missing or wrong idTransactionWompi');
    }

    if (!idProduct) {
      throw new Error('Missing or wrong idProduct');
    }

    const transaction = await this.repo.findOne(idTransactionWompi);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const wompiTransaction =
      await this.wompi.findTransaction(idTransactionWompi);
    if (!wompiTransaction) {
      throw new Error('Transaction not found in Wompi');
    }

    if (wompiTransaction.status !== 'PENDING') {
      const newTransaction = await this.repo.update({
        idTransactionWompi,
        finalizedAt: wompiTransaction?.finalized_at ?? '',
        status: wompiTransaction.status,
        statusMessage: wompiTransaction.status_message,
      });
      const product = await this.product.findOne(idProduct);
      if (!product) {
        throw new Error('Product not found');
      }
      await this.product.updateQuantity(idProduct, product.quantity - 1);
      return newTransaction;
    }
  }
}
