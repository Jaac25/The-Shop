import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreateUser } from 'src/application/use-cases/users/CreateUser';
import { USER_REPOSITORY } from 'src/domain/ports/user.repository';
import { UserController } from 'src/infraestructure/controllers/user.controller';
import { UserModel } from 'src/infraestructure/models/user.model';
import { SequelizeUserRepository } from 'src/infraestructure/repositories/user.repository';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [
    CreateUser,
    {
      provide: USER_REPOSITORY,
      useClass: SequelizeUserRepository,
    },
  ],
})
export class UsersModule {}
