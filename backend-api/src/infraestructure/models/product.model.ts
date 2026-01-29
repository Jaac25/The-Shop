import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { IProduct } from 'src/domain/entities/Product';

@Table({ tableName: 'products', timestamps: false })
export class ProductModel extends Model<IProduct, Omit<IProduct, 'idProduct'>> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  idProduct: number;

  @Column(DataType.STRING)
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image: string;

  @Column(DataType.INTEGER)
  price: number;

  @Column(DataType.INTEGER)
  quantity: number;
}
