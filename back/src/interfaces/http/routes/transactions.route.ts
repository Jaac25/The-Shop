import { Router } from "express";
import { CreateTransaction } from "../../../application/use-cases/transactions/CreateTransaction";
import { SequelizeTransactionRepository } from "../../../infraestructure/repositories/SequelizeTransactionRepository";

const transactionsRouter = Router();

transactionsRouter.post("/", (req, res) => {
  try {
    const useCase = new CreateTransaction(new SequelizeTransactionRepository());
    const transaction = useCase.execute({
      customer_email: req.body.customerEmail,
      idProduct: req.body.idProduct,
      token: req.body.token,
    });
    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(400).json(error?.toString());
  }
});

export default transactionsRouter;
