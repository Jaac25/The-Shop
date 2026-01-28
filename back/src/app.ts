import express from "express";
import cors from "cors";
import productsRouter from "./interfaces/http/routes/products.route";
import transactionsRouter from "./interfaces/http/routes/transactions.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productsRouter);
app.use("/transactions", transactionsRouter);

export default app;
