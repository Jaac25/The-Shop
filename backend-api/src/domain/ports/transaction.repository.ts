import { ITransaction, Transaction } from '../entities/Transaction';

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';

export interface TransactionRepository {
  create(transaction: Transaction): Promise<ITransaction>;
  update(transaction: Partial<ITransaction>): Promise<ITransaction | undefined>;
  findOne(idTransaction: string): Promise<ITransaction | undefined>;
}
