import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateOrder } from 'src/application/use-cases/orders/CreateOrder';
import { IOrder } from 'src/domain/entities/Order';

@Controller('orders')
export class OrderController {
  constructor(private readonly createOrder: CreateOrder) {}

  @Post()
  async create(@Body() body: Partial<IOrder>) {
    try {
      await this.createOrder.execute({
        idUser: body.idUser ?? '',
        idProduct: body.idProduct ?? '',
      });
      return { message: 'Order created successfully' };
    } catch (error) {
      console.error('Error creating order:', error);
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating order',
      );
    }
  }
}
