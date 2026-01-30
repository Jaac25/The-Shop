import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProductController } from './product.controller';
import { GetProducts } from 'src/application/use-cases/product/GetProducts';
import { IProduct } from 'src/domain/entities/Product';

describe('ProductController', () => {
  let controller: ProductController;
  let getProducts: jest.Mocked<GetProducts>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: GetProducts,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    getProducts = module.get(GetProducts);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return products when GetProducts succeeds', async () => {
    const productsMock: IProduct[] = [
      {
        idProduct: '1',
        name: 'Producto 1',
        price: 10000,
        quantity: 5,
      },
      {
        idProduct: '2',
        name: 'Producto 2',
        price: 20000,
        quantity: 3,
      },
    ];

    getProducts.execute.mockResolvedValue(productsMock);

    const result = await controller.findAll();

    const executeSpy = jest.spyOn(getProducts, 'execute');

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(productsMock);
  });

  it('should throw BadRequestException when GetProducts throws Error', async () => {
    getProducts.execute.mockRejectedValue(new Error('Cannot get products'));

    await expect(controller.findAll()).rejects.toThrow(BadRequestException);

    await expect(controller.findAll()).rejects.toThrow('Cannot get products');
  });

  it('should throw generic BadRequestException when error is not Error instance', async () => {
    getProducts.execute.mockRejectedValue('unexpected error');

    await expect(controller.findAll()).rejects.toThrow(BadRequestException);

    await expect(controller.findAll()).rejects.toThrow(
      'Error getting products',
    );
  });
});
