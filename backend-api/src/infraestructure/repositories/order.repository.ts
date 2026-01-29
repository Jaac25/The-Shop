import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from 'src/domain/entities/Order';
import { OrderRepository } from 'src/domain/ports/order.repository';
import { OrderModel } from '../models/order.model';

@Injectable()
export class SequelizeOrderRepository implements OrderRepository {
  constructor(
    @InjectModel(OrderModel)
    private readonly orderModel: typeof OrderModel,
  ) {}

  async create(order: Order): Promise<void> {
    await this.orderModel.create({
      idProduct: order.idProduct,
      idUser: order.idUser,
    });
  }
}
