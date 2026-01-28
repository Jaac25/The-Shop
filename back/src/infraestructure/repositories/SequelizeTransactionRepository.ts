import { Transaction } from "../../domain/entities/Transaction";
import { TransactionRepository } from "../../domain/repositories/TransactionRepository";
import { TransactionModel } from "../models/TransactionModel";

export class SequelizeTransactionRepository implements TransactionRepository {
  async create(transaction: Transaction): Promise<Transaction> {
    const res = await TransactionModel.create(transaction);
    return res;
  }
}
