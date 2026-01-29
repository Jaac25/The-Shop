import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreateAddress } from 'src/application/use-cases/address/CreateAddress';
import { CreateOrder } from 'src/application/use-cases/orders/CreateOrder';
import { CreateUser } from 'src/application/use-cases/users/CreateUser';
import { ADDRESS_REPOSITORY } from 'src/domain/ports/address.repository';
import { ORDER_REPOSITORY } from 'src/domain/ports/order.repository';
import { USER_REPOSITORY } from 'src/domain/ports/user.repository';
import { OrderController } from 'src/infraestructure/controllers/order.controller';
import { OrderModel } from 'src/infraestructure/models/order.model';
import { AddressModel } from 'src/infraestructure/models/address.model';
import { UserModel } from 'src/infraestructure/models/user.model';
import { SequelizeOrderRepository } from 'src/infraestructure/repositories/order.repository';
import { SequelizeAddressRepository } from 'src/infraestructure/repositories/address.repository';
import { SequelizeUserRepository } from 'src/infraestructure/repositories/user.repository';

@Module({
  imports: [SequelizeModule.forFeature([OrderModel, AddressModel, UserModel])],
  controllers: [OrderController],
  providers: [
    CreateOrder,
    CreateAddress,
    CreateUser,
    {
      provide: ORDER_REPOSITORY,
      useClass: SequelizeOrderRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: SequelizeUserRepository,
    },
    {
      provide: ADDRESS_REPOSITORY,
      useClass: SequelizeAddressRepository,
    },
  ],
})
export class OrderModule {}
