import { Router } from "express";
import { GetProducts } from "../../../application/use-cases/product/GetProducts";
import { SequelizeProductRepository } from "../../../infraestructure/repositories/SequelizeProductRepository";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  const useCase = new GetProducts(new SequelizeProductRepository());
  const products = await useCase.execute();
  return res.status(200).json(products);
});

export default productsRouter;
