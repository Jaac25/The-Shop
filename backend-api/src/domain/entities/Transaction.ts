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

  get idTransaction(): string | undefined {
    return this.attributes.idTransaction;
  }

  get idTransactionWompi(): string {
    return this.attributes.idTransactionWompi;
  }

  get idOrder(): number {
    return this.attributes.idOrder;
  }

  get createdAt(): string {
    return this.attributes.createdAt;
  }

  get amountInCents(): number {
    return this.attributes.amountInCents;
  }

  get reference(): string {
    return this.attributes.reference;
  }

  get customerEmail(): string {
    return this.attributes.customerEmail;
  }

  get status(): string {
    return this.attributes.status;
  }

  get finalizedAt(): string | undefined {
    return this.attributes.finalizedAt;
  }

  get statusMessage(): string | undefined {
    return this.attributes.statusMessage;
  }

  get token(): string | undefined {
    return this.attributes.token;
  }
}
