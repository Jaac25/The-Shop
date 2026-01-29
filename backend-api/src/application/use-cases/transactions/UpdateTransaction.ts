import { Inject, Injectable } from '@nestjs/common';
import { ITransaction } from 'src/domain/entities/Transaction';
import type { TransactionRepository } from 'src/domain/ports/transaction.repository';
import { TRANSACTION_REPOSITORY } from 'src/domain/ports/transaction.repository';
import { FindTransactionWompiService } from 'src/infraestructure/wompi/wompi-transaction.service';

@Injectable()
export class UpdateTransaction {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repo: TransactionRepository,
    private readonly wompi: FindTransactionWompiService,
  ) {}

  async execute({ id }: { id: string }): Promise<ITransaction | undefined> {
    if (!id) {
      throw new Error('Missing or wrong id');
    }

    const transactionWompi = await this.wompi.findTransaction(id);
    if (!transactionWompi) {
      throw new Error('Transaction not found');
    }

    await this.repo.update({
      idTransactionWompi: id,
      finalizedAt: transactionWompi.finalized_at,
      status: transactionWompi.status,
      statusMessage: transactionWompi.status_message,
    });
    return this.repo.findOne(id);
  }
}
