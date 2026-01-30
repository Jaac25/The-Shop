export interface ITransaction {
  idTransaction?: string;
  idTransactionWompi: string;
  idOrder: number;
  createdAt: string;
  amountInCents: number;
  reference: string;
  customerEmail: string;
  status: string;
  finalizedAt?: string;
  statusMessage?: string;
  token?: string;
}

export class Transaction {
  constructor(private attributes: ITransaction) {}
}
