import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { IOrder } from 'src/domain/entities/Order';

@Table({ tableName: 'orders', timestamps: false })
export class OrderModel extends Model<IOrder, Omit<IOrder, 'idOrder'>> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  idOrder: number;

  @Column(DataType.STRING)
  idProduct: string;

  @Column(DataType.STRING)
  idUser: string;

  @Column(DataType.STRING)
  idAddress: string;
}
