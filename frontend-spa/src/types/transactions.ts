import type { Product } from "./product";

/**
 * @url /transactions
 * @method GET
 * @type Response
 */
export interface ITransaction {
  idTransaction: number;
  idTransactionWompi: string;
  idOrder: number;
  createdAt: string;
  finalizedAt: string;
  amountInCents: number;
  reference: string;
  customerEmail: string;
  status?: "ERROR" | "PENDING" | "APPROVED" | "DECLINED";
  statusMessage?: string;
}

export type TransactionResume = ITransaction & { product: Product, name: string, cardLast4: string , address: string};