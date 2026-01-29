import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IUser } from 'src/domain/entities/User';
import { UserRepository } from 'src/domain/ports/user.repository';
import { UserModel } from '../models/user.model';

@Injectable()
export class SequelizeUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  async create(user: IUser): Promise<void> {
    await this.userModel.create({
      name: user.name,
      email: user.email,
    });
  }
}
