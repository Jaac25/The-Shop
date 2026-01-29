import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreateOrder } from 'src/application/use-cases/orders/CreateOrder';
import { ORDER_REPOSITORY } from 'src/domain/ports/order.repository';
import { OrderController } from 'src/infraestructure/controllers/order.controller';
import { OrderModel } from 'src/infraestructure/models/order.model';
import { SequelizeOrderRepository } from 'src/infraestructure/repositories/order.repository';

@Module({
  imports: [SequelizeModule.forFeature([OrderModel])],
  controllers: [OrderController],
  providers: [
    CreateOrder,
    {
      provide: ORDER_REPOSITORY,
      useClass: SequelizeOrderRepository,
    },
  ],
})
export class OrderModule {}
