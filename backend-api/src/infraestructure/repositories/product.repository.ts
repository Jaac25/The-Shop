import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IProduct } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/ports/product.repository';
import { ProductModel } from '../models/product.model';

@Injectable()
export class SequelizeProductRepository implements ProductRepository {
  constructor(
    @InjectModel(ProductModel)
    private productModel: typeof ProductModel,
  ) {}

  async findAll(): Promise<IProduct[]> {
    const res = await this.productModel.findAll();
    return res.map(({ dataValues }) => dataValues);
  }
}
