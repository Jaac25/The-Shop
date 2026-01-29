export interface IOrder {
  idOrder?: string;
  idProduct: string;
  idUser: string;
}

export class Order {
  constructor(private attributes: IOrder) {}

  get idOrder(): string | undefined {
    return this.attributes.idOrder;
  }
  get idProduct(): string | undefined {
    return this.attributes.idProduct;
  }
  get idUser(): string | undefined {
    return this.attributes.idUser;
  }
}
