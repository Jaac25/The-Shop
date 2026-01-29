import { IAddress } from '../entities/Address';

export const ADDRESS_REPOSITORY = 'ADDRESS_REPOSITORY';

export interface AddressRepository {
  create(address: IAddress): Promise<{ id: string }>;
}
