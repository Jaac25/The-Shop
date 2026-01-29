import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreateTransaction } from 'src/application/use-cases/transactions/CreateTransaction';
import { FindTransaction } from 'src/application/use-cases/transactions/FindTransaction';
import { UpdateTransaction } from 'src/application/use-cases/transactions/UpdateTransaction';
import { TRANSACTION_REPOSITORY } from 'src/domain/ports/transaction.repository';
import { TransactionController } from 'src/infraestructure/controllers/transaction.controller';
import { TransactionModel } from 'src/infraestructure/models/transaction.model';
import { SequelizeTransactionRepository } from 'src/infraestructure/repositories/transaction.repository';
import { WompiMerchantService } from 'src/infraestructure/wompi/wompi-merchant.service';
import {
  FindTransactionWompiService,
  WompiService,
} from 'src/infraestructure/wompi/wompi-transaction.service';

@Module({
  imports: [SequelizeModule.forFeature([TransactionModel])],
  controllers: [TransactionController],
  providers: [
    CreateTransaction,
    FindTransaction,
    UpdateTransaction,
    WompiMerchantService,
    FindTransactionWompiService,
    WompiService,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: SequelizeTransactionRepository,
    },
  ],
})
export class TransactionModule {}
