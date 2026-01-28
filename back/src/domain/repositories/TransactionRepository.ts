import { Transaction } from "../entities/Transaction";

export interface TransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
}
