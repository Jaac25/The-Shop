import { BadRequestException, Controller, Get } from '@nestjs/common';
import { GetProducts } from 'src/application/use-cases/product/GetProducts';

@Controller('products')
export class ProductController {
  constructor(private readonly getProducts: GetProducts) {}

  @Get()
  async findAll() {
    try {
      return await this.getProducts.execute();
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error getting products',
      );
    }
  }
}
