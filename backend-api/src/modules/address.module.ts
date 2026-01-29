import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreateAddress } from 'src/application/use-cases/address/CreateAddress';
import { ADDRESS_REPOSITORY } from 'src/domain/ports/address.repository';
import { AddressController } from 'src/infraestructure/controllers/address.controller';
import { AddressModel } from 'src/infraestructure/models/address.model';
import { SequelizeAddressRepository } from 'src/infraestructure/repositories/address.repository';

@Module({
  imports: [SequelizeModule.forFeature([AddressModel])],
  controllers: [AddressController],
  providers: [
    CreateAddress,
    {
      provide: ADDRESS_REPOSITORY,
      useClass: SequelizeAddressRepository,
    },
  ],
})
export class AddressModule {}
