import { GetProducts } from './GetProducts';
import type { ProductRepository } from 'src/domain/ports/product.repository';
import type { IProduct } from 'src/domain/entities/Product';

describe('GetProducts', () => {
  let useCase: GetProducts;
  let repo: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      updateQuantity: jest.fn(),
    };

    useCase = new GetProducts(repo);
  });

  it('should return products from repository', async () => {
    const products: IProduct[] = [
      { name: 'Product 1', price: 1000, quantity: 10, idProduct: '1' },
      { name: 'Product 2', price: 2000, quantity: 0, idProduct: '2' },
    ];

    repo.findAll.mockResolvedValue(products);

    const result = await useCase.execute();

    expect(repo.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(products);
  });
});
