import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateOrder } from 'src/application/use-cases/orders/CreateOrder';

@Controller('orders')
export class OrderController {
  constructor(private readonly createOrder: CreateOrder) {}

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      email: string;
      address: string;
      idProduct: string;
    },
  ): Promise<{ message: string }> {
    try {
      await this.createOrder.execute(body);
      return { message: 'Order created successfully' };
    } catch (error) {
      console.error('Error creating order:', error);
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating order',
      );
    }
  }
}
