import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { IUser } from 'src/domain/entities/User';

@Table({ tableName: 'users', timestamps: false })
export class UserModel extends Model<IUser, Omit<IUser, 'idUser'>> {
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
