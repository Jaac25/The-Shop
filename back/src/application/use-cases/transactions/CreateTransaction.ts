import { Transaction } from "../../../domain/entities/Transaction";
import { TransactionRepository } from "../../../domain/repositories/TransactionRepository";
import { createTransaction } from "../../../infraestructure/paymentGateway/wompi/requests/createTransaction";
import { getAcceptanceToken } from "./GetAcceptanceToken";

export class CreateTransaction {
  constructor(private repo: TransactionRepository) {}

  async execute({
    amount_in_cents,
    customer_email,
    idProduct,
    token,
  }: {
    amount_in_cents?: number;
    idProduct: string;
    customer_email: string;
    token: string;
  }): Promise<Transaction> {
    if (
      !amount_in_cents ||
      typeof amount_in_cents !== "number" ||
      amount_in_cents > 100000000000000
    )
      throw new Error("Missing or wrong amount_in_cents");
    if (!idProduct) throw new Error("Missing or wrong idProduct");

    const acceptance_token = await getAcceptanceToken();
    if (!acceptance_token)
      throw new Error("Not was possible get the acceptance token");

    const transaction = await createTransaction(
      {
        acceptance_token,
        amount_in_cents,
        currency: "COP",
        customer_email,
        payment_method: { token },
      },
      idProduct,
    );
    return this.repo.create(
      new Transaction(
        transaction.id,
        idProduct,
        transaction.created_at,
        transaction.amount_in_cents,
        transaction.reference,
        transaction.customer_email,
        transaction.status,
        undefined,
        transaction.finalized_at,
        transaction.status_message,
      ),
    );
  }
}
