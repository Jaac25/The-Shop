import { TRANSACTION_STATUS } from "../../infraestructure/paymentGateway/wompi/types/transactions";

export class Transaction {
  constructor(
    public idTransactionWompi: string,
    public idProduct: string,
    public createdAt: string,
    public amountInCents: number,
    public reference: string,
    public customerEmail: string,
    public status: TRANSACTION_STATUS,
    public idTransaction?: string,
    public finalizedAt?: string,
    public statusMessage?: string | null,
    public token?: string,
  ) {}
}
