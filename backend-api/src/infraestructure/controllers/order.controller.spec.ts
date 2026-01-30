import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OrderController } from './order.controller';
import { CreateOrder } from 'src/application/use-cases/orders/CreateOrder';

describe('OrderController', () => {
  let controller: OrderController;
  let createOrder: jest.Mocked<CreateOrder>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: CreateOrder,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    createOrder = module.get(CreateOrder);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an order and return the id', async () => {
    const executeSpy = jest.spyOn(createOrder, 'execute');
    const body = {
      name: 'Alexander',
      email: 'alex@test.com',
      address: 'Calle 123',
      idProduct: 'prod-1',
    };

    createOrder.execute.mockResolvedValue({
      id: 'order-123',
    });

    const result = await controller.create(body);

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith(body);
    expect(result).toEqual({ id: 'order-123' });
  });

  it('should throw BadRequestException when CreateOrder fails', async () => {
    const body = {
      name: 'Alexander',
      email: 'alex@test.com',
      address: 'Calle 123',
      idProduct: 'prod-1',
    };

    createOrder.execute.mockRejectedValue(
      new Error('Order could not be created'),
    );

    await expect(controller.create(body)).rejects.toThrow(BadRequestException);

    await expect(controller.create(body)).rejects.toThrow(
      'Order could not be created',
    );
  });

  it('should throw generic BadRequestException if error is not an Error instance', async () => {
    const body = {
      name: 'Alexander',
      email: 'alex@test.com',
      address: 'Calle 123',
      idProduct: 'prod-1',
    };

    createOrder.execute.mockRejectedValue('unexpected error');

    await expect(controller.create(body)).rejects.toThrow(BadRequestException);

    await expect(controller.create(body)).rejects.toThrow(
      'Error creating order',
    );
  });
});
