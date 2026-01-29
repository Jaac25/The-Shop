import { Inject } from '@nestjs/common';
import { IProduct } from 'src/domain/entities/Product';
import type { ProductRepository } from 'src/domain/ports/product.repository';
import { PRODUCT_REPOSITORY } from 'src/domain/ports/product.repository';

export class GetProducts {
  constructor(@Inject(PRODUCT_REPOSITORY) private repo: ProductRepository) {}

  execute(): Promise<IProduct[]> {
    return this.repo.findAll();
  }
}
