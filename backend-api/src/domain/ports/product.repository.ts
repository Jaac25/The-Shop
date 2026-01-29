import { IProduct } from '../entities/Product';

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';

export interface ProductRepository {
  findOne(id: string): Promise<IProduct>;
  findAll(): Promise<IProduct[]>;
  updateQuantity(id: string, quantity: number): Promise<void>;
}
