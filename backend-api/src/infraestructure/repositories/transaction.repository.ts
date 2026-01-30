import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ITransaction } from '../../domain/entities/Transaction';
import { TransactionRepository } from '../../domain/ports/transaction.repository';
import { TransactionModel } from '../models/transaction.model';

@Injectable()
export class SequelizeTransactionRepository implements TransactionRepository {
  constructor(
    @InjectModel(TransactionModel)
    private readonly transactionModel: typeof TransactionModel,
  ) {}

  async findOne(idTransaction: string): Promise<ITransaction | undefined> {
    const res = await this.transactionModel.findOne({
      where: { idTransactionWompi: idTransaction },
    });

    const transaction: ITransaction = {
      amountInCents: res?.dataValues?.amountInCents ?? 0,
      idTransactionWompi: res?.dataValues?.idTransactionWompi ?? '',
      idOrder: res?.dataValues?.idOrder ?? 0,
      createdAt: res?.dataValues?.createdAt ?? '',
      reference: res?.dataValues?.reference ?? '',
      customerEmail: res?.dataValues?.customerEmail ?? '',
      status: res?.dataValues?.status ?? '',
      finalizedAt: res?.dataValues?.finalizedAt ?? '',
      statusMessage: res?.dataValues?.statusMessage,
      idTransaction: res?.dataValues?.idTransaction?.toString(),
    };
    return transaction;
  }

  async create(transaction: ITransaction): Promise<ITransaction> {
    const newTransaction = await this.transactionModel.create({
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
    return { ...newTransaction.dataValues };
  }

  async update(
    transaction: Partial<ITransaction>,
  ): Promise<ITransaction | undefined> {
    await this.transactionModel.update(transaction, {
      where: { idTransactionWompi: transaction.idTransactionWompi },
    });
    return this.findOne(transaction.idTransactionWompi ?? '');
  }
}
