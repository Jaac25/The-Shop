import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'address', timestamps: false })
export class AddressModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  idAddress: number;

  @Column(DataType.STRING)
  idOrder: string;

  @Column(DataType.STRING)
  address: string;
}
