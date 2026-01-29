import { Inject, Injectable } from '@nestjs/common';
import { IAddress } from 'src/domain/entities/Address';
import type { AddressRepository } from 'src/domain/ports/address.repository';
import { ADDRESS_REPOSITORY } from 'src/domain/ports/address.repository';
import { NUMBER_REGEX } from 'src/shared/regex.constants';

@Injectable()
export class CreateAddress {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly repo: AddressRepository,
  ) {}

  async execute({ address, idOrder }: IAddress): Promise<void> {
    if (!address) {
      throw new Error('Missing or wrong address');
    }

    if (!idOrder || !NUMBER_REGEX.test(idOrder)) {
      throw new Error('Missing or wrong idOrder');
    }

    await this.repo.create({
      address,
      idOrder,
    });
  }
}
