import { Inject, Injectable } from '@nestjs/common';
import { ITransaction, Transaction } from 'src/domain/entities/Transaction';
import type { MerchantService } from 'src/domain/ports/MerchantService.repository';
import type { TransactionRepository } from 'src/domain/ports/transaction.repository';
import { TRANSACTION_REPOSITORY } from 'src/domain/ports/transaction.repository';
import { WompiService } from 'src/infraestructure/wompi/wompi-transaction.service';

@Injectable()
export class CreateTransaction {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repo: TransactionRepository,
    private readonly wompiTransaction: WompiService,
    private readonly wompiMerchant: MerchantService,
  ) {}

  async execute({
    amount_in_cents,
    customer_email,
    idOrder,
    token,
  }: {
    amount_in_cents?: number;
    idOrder?: number;
    customer_email: string;
    token: string;
  }): Promise<ITransaction> {
    if (
      !amount_in_cents ||
      typeof amount_in_cents !== 'number' ||
      amount_in_cents > 100000000000000 ||
      amount_in_cents < 150000 //1.500
    ) {
      throw new Error('Missing or wrong amount_in_cents');
    }

    if (!idOrder) {
      throw new Error('Missing or wrong idOrder');
    }

    const acceptance_token = await this.wompiMerchant.execute();

    const transaction = await this.wompiTransaction.createTransaction(
      {
        amount_in_cents,
        currency: 'COP',
        customer_email,
        payment_method: {
          type: 'CARD',
          installments: '1',
          token,
        },

        acceptance_token: acceptance_token || '',
      },
      idOrder,
    );

    if (!transaction) {
      throw new Error('Not was possible paying');
    }

    const t = await this.repo.create(
      {
        amountInCents: amount_in_cents,
        createdAt: transaction.created_at,
        idOrder: parseInt(idOrder.toString()) ?? 0,
        customerEmail: customer_email,
        idTransactionWompi: transaction.id,
        reference: transaction.reference,
        status: transaction.status,
        finalizedAt: transaction.finalized_at,
        statusMessage: transaction.status_message,
      }
    );

    return t;
  }
}
