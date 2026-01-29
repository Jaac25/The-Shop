import { Inject } from '@nestjs/common';
import type { ProductRepository } from 'src/domain/ports/product.repository';
import { PRODUCT_REPOSITORY } from 'src/domain/ports/product.repository';
import { Product } from 'src/domain/entities/Product';

export class GetProducts {
  constructor(@Inject(PRODUCT_REPOSITORY) private repo: ProductRepository) {}

  execute(): Promise<Product[]> {
    return this.repo.findAll();
  }
}
