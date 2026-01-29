import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'orders', timestamps: false })
export class OrderModel extends Model {
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
}
