import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateAddress } from 'src/application/use-cases/address/CreateAddress';
import { IAddress } from 'src/domain/entities/Address';

@Controller('addresses')
export class AddressController {
  constructor(private readonly createAddress: CreateAddress) {}

  @Post()
  async create(@Body() body: Partial<IAddress>) {
    try {
      await this.createAddress.execute({
        address: body?.address ?? '',
      });
      return { message: 'Address created successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating address',
      );
    }
  }
}
