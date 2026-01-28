import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize";
import { Transaction } from "../../domain/entities/Transaction";
import { ProductModel } from "./ProductModel";

export interface TransactionInstance extends Model<Transaction>, Transaction {}

export const TransactionModel = sequelize.define<TransactionInstance>(
  "transactions",
  {
    idTransaction: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idTransactionWompi: DataTypes.STRING,
    idProduct: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    finalizedAt: DataTypes.DATE,
    amountInCents: DataTypes.FLOAT,
    reference: DataTypes.STRING,
    customerEmail: DataTypes.STRING,
    status: DataTypes.STRING,
    statusMessage: DataTypes.STRING,
  },
  {
    timestamps: false,
    freezeTableName: true,
  },
);

TransactionModel.belongsTo(ProductModel, { foreignKey: "idProduct" });
