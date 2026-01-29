import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionRepository } from '../../domain/ports/transaction.repository';
import { TransactionModel } from '../models/transaction.model';

@Injectable()
export class SequelizeTransactionRepository implements TransactionRepository {
  constructor(
    @InjectModel(TransactionModel)
    private readonly transactionModel: typeof TransactionModel,
  ) {}

  async create(transaction: Transaction): Promise<void> {
    await this.transactionModel.create({
      status: transaction.status,
      amountInCents: transaction.amountInCents,
      customerEmail: transaction.customerEmail,
      createdAt: transaction.createdAt,
      finalizedAt: transaction.finalizedAt,
      idOrder: transaction.idOrder,
      idTransactionWompi: transaction.idTransactionWompi,
      reference: transaction.reference,
      statusMessage: transaction.statusMessage,
    });
  }

  async update(transaction: Transaction): Promise<void> {
    await this.transactionModel.update(transaction, {
      where: { id: transaction.idTransaction },
    });
  }
}
