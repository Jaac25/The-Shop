import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IAddress } from 'src/domain/entities/Address';
import { AddressRepository } from 'src/domain/ports/address.repository';
import { AddressModel } from '../models/address.model';

@Injectable()
export class SequelizeAddressRepository implements AddressRepository {
  constructor(
    @InjectModel(AddressModel)
    private readonly addressModel: typeof AddressModel,
  ) {}

  async create(address: IAddress): Promise<{ id: string }> {
    const a = await this.addressModel.create({
      address: address.address,
    });
    return { id: a.idAddress.toString() };
  }
}
