import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/ports/product.repository';
import { ProductModel } from '../models/product.model';

@Injectable()
export class SequelizeProductRepository implements ProductRepository {
  constructor(
    @InjectModel(ProductModel)
    private productModel: typeof ProductModel,
  ) {}

  async findAll(): Promise<Product[]> {
    const res = await this.productModel.findAll();
    return res.map(({ dataValues }) => dataValues as Product);
  }
}
