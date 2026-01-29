import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Query,
  Patch,
  Post,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { CreateTransaction } from 'src/application/use-cases/transactions/CreateTransaction';
import { FindTransaction } from 'src/application/use-cases/transactions/FindTransaction';
import { UpdateTransaction } from 'src/application/use-cases/transactions/UpdateTransaction';
import type { ITransaction } from 'src/domain/entities/Transaction';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransaction: CreateTransaction,
    private readonly findTransaction: FindTransaction,
    private readonly updateTransaction: UpdateTransaction,
  ) {}

  @Get()
  async findAll(
    @Query('id') id: string,
    @Query('idProduct') idProduct: string,
  ) {
    try {
      return await this.findTransaction.execute({
        idTransactionWompi: id,
        idProduct,
      });
    } catch (e) {
      const err = e as AxiosError<{ error?: { reason: string } }>;
      throw new BadRequestException(
        `Error getting transaction: ${err?.response?.data?.error?.reason ?? 'Unknown error'}`,
      );
    }
  }

  @Post()
  async create(@Body() body: Partial<ITransaction>) {
    try {
      const transaction = await this.createTransaction.execute({
        customer_email: body.customerEmail ?? '',
        idOrder: body.idOrder,
        amount_in_cents: parseFloat(`${body.amountInCents}`) ?? 0,
        token: body.token ?? '',
      });
      return transaction;
    } catch (e) {
      const error = e as AxiosError<{
        error: {
          messages?: Record<
            string,
            { messages?: Record<string, string | string[]> | string[] }
          >;
        };
      }>;

      const errors = Object.entries(
        error?.response?.data?.error?.messages ?? {},
      ).flatMap(([k, v]) => {
        if (Array.isArray(v)) return `${k}: ${v.join(', ')}`;
        return `${k} -> ${Object.entries(v.messages ?? {})
          .map(
            ([key, value]) =>
              `${key}: ${typeof value === 'string' ? value : value.join(', ')}`,
          )
          .join(', ')}`;
      });
      throw new BadRequestException(
        errors?.length
          ? errors.join('\n')
          : `Error creating transaction: ${error.toString()}`,
      );
    }
  }

  @Patch()
  async update(@Body() body: { id: string }) {
    try {
      await this.updateTransaction.execute({
        id: body.id ?? '',
      });
      return { message: 'Transaction updated successfully' };
    } catch (e) {
      const error = e as AxiosError<{
        error: {
          messages?: Record<
            string,
            { messages?: Record<string, string | string[]> }
          >;
        };
      }>;

      const errors = Object.entries(
        error?.response?.data?.error?.messages ?? {},
      ).flatMap(
        ([k, v]) =>
          `${k} -> ${Object.entries(v.messages ?? {})
            .map(
              ([key, value]) =>
                `${key}: ${typeof value === 'string' ? value : value.join(', ')}`,
            )
            .join(', ')}`,
      );
      throw new BadRequestException(
        errors?.length
          ? errors.join('\n')
          : `Error updating transaction: ${error.toString()}`,
      );
    }
  }
}
