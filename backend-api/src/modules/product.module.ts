import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GetProducts } from 'src/application/use-cases/product/GetProducts';
import { PRODUCT_REPOSITORY } from 'src/domain/ports/product.repository';
import { ProductController } from 'src/infraestructure/controllers/product.controller';
import { ProductModel } from 'src/infraestructure/models/product.model';
import { SequelizeProductRepository } from 'src/infraestructure/repositories/product.repository';

@Module({
  imports: [SequelizeModule.forFeature([ProductModel])],
  controllers: [ProductController],
  providers: [
    GetProducts,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: SequelizeProductRepository,
    },
  ],
})
export class ProductModule {}
