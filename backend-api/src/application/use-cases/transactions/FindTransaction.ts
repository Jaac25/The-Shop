import { Inject, Injectable } from '@nestjs/common';
import { ITransaction } from 'src/domain/entities/Transaction';
import type { TransactionRepository } from 'src/domain/ports/transaction.repository';
import { TRANSACTION_REPOSITORY } from 'src/domain/ports/transaction.repository';
import { FindTransactionWompiService } from 'src/infraestructure/wompi/wompi-transaction.service';

@Injectable()
export class FindTransaction {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repo: TransactionRepository,
    private readonly wompi: FindTransactionWompiService,
  ) {}

  async execute({
    idTransactionWompi,
  }: {
    idTransactionWompi: string;
  }): Promise<ITransaction | undefined> {
    if (!idTransactionWompi) {
      throw new Error('Missing or wrong idTransactionWompi');
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

    const newTransaction = await this.repo.update({
      idTransactionWompi,
      finalizedAt: wompiTransaction?.finalized_at ?? '',
      status: wompiTransaction.status,
      statusMessage: wompiTransaction.status_message,
    });

    return newTransaction;
  }
}
