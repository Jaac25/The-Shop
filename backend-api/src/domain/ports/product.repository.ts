import { IProduct } from '../entities/Product';

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';

export interface ProductRepository {
  findAll(): Promise<IProduct[]>;
}
