import { ITransaction } from '../entities/Transaction';

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';

export interface TransactionRepository {
  create(this: void, transaction: ITransaction): Promise<ITransaction>;
  update(
    this: void,
    transaction: Partial<ITransaction>,
  ): Promise<ITransaction | undefined>;
  findOne(this: void, idTransaction: string): Promise<ITransaction | undefined>;
}
