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

  async findOne(id: string): Promise<IProduct> {
    const res = await this.productModel.findOne({ where: { idProduct: id } });
    return {
      name: res?.dataValues?.name ?? '',
      quantity: res?.dataValues?.quantity ?? 0,
      idProduct: res?.dataValues?.idProduct ?? '',
      price: res?.dataValues?.price ?? 0,
    };
  }

  async findAll(): Promise<IProduct[]> {
    const res = await this.productModel.findAll();
    return res.map(({ dataValues }) => dataValues);
  }

  async updateQuantity(id: string, quantity: number): Promise<void> {
    await this.productModel.update({ quantity }, { where: { idProduct: id } });
  }
}
