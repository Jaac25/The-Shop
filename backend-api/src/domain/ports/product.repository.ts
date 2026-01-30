import { IProduct } from '../entities/Product';

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';

export interface ProductRepository {
  findOne(this: void, id: string): Promise<IProduct>;
  findAll(this: void): Promise<IProduct[]>;
  updateQuantity(this: void, id: string, quantity: number): Promise<void>;
}
