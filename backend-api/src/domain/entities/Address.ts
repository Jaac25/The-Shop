export interface IAddress {
  idAddress?: string;
  address: string;
  idOrder: string;
}

export class Address {
  constructor(private attributes: IAddress) {}
}
