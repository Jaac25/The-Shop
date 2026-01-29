import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { OrderModel } from './order.model';
import { ITransaction } from 'src/domain/entities/Transaction';

@Table({ tableName: 'transactions', timestamps: false })
export class TransactionModel extends Model<
  ITransaction,
  Omit<ITransaction, 'idTransaction'>
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  idTransaction: number;

  @Column(DataType.STRING)
  idTransactionWompi: string;

  @ForeignKey(() => OrderModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  idOrder: number;

  @Column(DataType.STRING)
  declare createdAt: string;

  @Column(DataType.STRING)
  finalizedAt: string;

  @Column(DataType.FLOAT)
  amountInCents: number;

  @Column(DataType.STRING)
  reference: string;

  @Column(DataType.STRING)
  customerEmail: string;

  @Column(DataType.STRING)
  status: string;

  @Column(DataType.STRING)
  statusMessage: string;
}
