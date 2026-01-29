import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false })
export class UserModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  idUser: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  email: string;
}
