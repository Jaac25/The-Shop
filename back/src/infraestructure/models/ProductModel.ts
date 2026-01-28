import { Product } from "../../domain/entities/Product";
import { sequelize } from "../db/sequelize";

import { DataTypes, Model } from "sequelize";

interface ProductInstance extends Model<Product>, Product {}

export const ProductModel = sequelize.define<ProductInstance>(
  "Products",
  {
    idProduct: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    image: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    price: DataTypes.INTEGER,
  },
  {
    timestamps: false,
    freezeTableName: true, // Opcional: para evitar la pluralización del nombre de la tabla
  },
);
