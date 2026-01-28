import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { Product } from "../../domain/entities/Product";
import { ProductModel } from "../models/ProductModel";

export class SequelizeProductRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    const res = await ProductModel.findAll();
    return res.map(({ dataValues }) => ({
      id: dataValues.id,
      image: dataValues.image,
      name: dataValues.name,
      price: dataValues.price,
    }));
  }
}
