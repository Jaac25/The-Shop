import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { IAddress } from 'src/domain/entities/Address';

@Table({ tableName: 'addresses', timestamps: false })
export class AddressModel extends Model<IAddress, Omit<IAddress, 'idAddress'>> {
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
