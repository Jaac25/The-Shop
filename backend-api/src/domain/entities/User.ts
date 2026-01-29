export interface IUser {
  idUser?: string;
  name: string;
  email: string;
}

export class User {
  constructor(private attributes: IUser) {}
}
