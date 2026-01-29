import { Inject, Injectable } from '@nestjs/common';
import type { AddressRepository } from 'src/domain/ports/address.repository';
import { ADDRESS_REPOSITORY } from 'src/domain/ports/address.repository';
import type { OrderRepository } from 'src/domain/ports/order.repository';
import { ORDER_REPOSITORY } from 'src/domain/ports/order.repository';
import type { UserRepository } from 'src/domain/ports/user.repository';
import { USER_REPOSITORY } from 'src/domain/ports/user.repository';
import { NUMBER_REGEX } from 'src/shared/regex.constants';

@Injectable()
export class CreateOrder {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: OrderRepository,
    @Inject(USER_REPOSITORY)
    private readonly user: UserRepository,
    @Inject(ADDRESS_REPOSITORY)
    private readonly address: AddressRepository,
  ) {}

  async execute({
    name,
    email,
    address,
    idProduct,
  }: {
    name: string;
    email: string;
    address: string;
    idProduct: string;
  }): Promise<{ id: string }> {
    if (!idProduct || !NUMBER_REGEX.test(idProduct)) {
      throw new Error('Missing or wrong idProduct ');
    }

    const { id: idUser } = await this.user.create({ name, email });

    if (!idUser) {
      throw new Error('Missing or wrong idUser');
    }

    const { id: idAddress } = await this.address.create({ address });

    if (!idAddress) {
      throw new Error('Missing or wrong idAddress');
    }

    const { id } = await this.repo.create({
      idProduct,
      idUser,
      idAddress,
    });
    if (!id) {
      throw new Error('Error creating order');
    }

    return { id };
  }
}
