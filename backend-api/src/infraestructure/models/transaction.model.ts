import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { OrderModel } from './order.model';

@Table({ tableName: 'transactions', timestamps: false })
export class TransactionModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  idTransaction: number;

  @Column(DataType.STRING)
  idTransactionWompi: string;

  @ForeignKey(() => OrderModel)
  @Column(DataType.STRING)
  idOrder: string;

  @Column(DataType.DATE)
  declare createdAt: Date;

  @Column(DataType.DATE)
  finalizedAt: Date;

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

  @BelongsTo(() => OrderModel)
  order: OrderModel;
}
