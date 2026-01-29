export interface IAddress {
  idAddress?: string;
  address: string;
}

export class Address {
  constructor(private attributes: IAddress) {}
}
