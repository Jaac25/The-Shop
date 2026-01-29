import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateTransaction } from 'src/application/use-cases/transactions/CreateTransaction';
import type { ITransaction } from 'src/domain/entities/Transaction';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly createTransaction: CreateTransaction) {}

  @Post()
  async create(@Body() body: Partial<ITransaction>) {
    try {
      await this.createTransaction.execute({
        customer_email: body.customerEmail ?? '',
        idOrder: body.idOrder ?? '',
        amount_in_cents: body.amountInCents ?? 0,
        token: body.token ?? '',
      });
      return { message: 'Transaction created successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating transaction',
      );
    }
  }
}
