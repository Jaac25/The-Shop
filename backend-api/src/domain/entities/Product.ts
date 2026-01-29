export interface IProduct {
  idProduct?: string;
  name: string;
  price: number;
  image?: string;
}

export class Product {
  constructor(private attributes: IProduct) {}
}
