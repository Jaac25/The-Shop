import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { ITransactionBody, ITransactionWompi } from './types/transactions';
import { IMetadata } from './types/common';
import { createHash } from 'crypto';
import { IMerchantResponse } from './types/merchants/[publicKey]';

const generateSHA256 = (text: string): string => {
  return createHash('sha256').update(text).digest('hex');
};

@Injectable()
export class WompiService {
  constructor(private readonly config: ConfigService) {}

  async createTransaction(body: ITransactionBody, idProduct: string) {
    const reference = `${idProduct}_${uuid()}`;

    const concatenatedText =
      `${reference}${body.amount_in_cents}${body.currency}` +
      this.config.get('WOMPI_INTEGRITY_KEY');

    const hash = generateSHA256(concatenatedText);

    const response = await axios.post<IMetadata<ITransactionWompi>>(
      `${this.config.get('WOMPI_ENVIRONMENT')}/transactions`,
      {
        ...body,
        signature: hash,
        reference,
      },
      {
        headers: {
          Authorization: `Bearer ${this.config.get('WOMPI_PUBLIC_KEY')}`,
        },
      },
    );

    return response.data.data;
  }
}

@Injectable()
export class GetAcceptanceTokenService {
  constructor(private readonly config: ConfigService) {}

  async execute(): Promise<string | undefined> {
    const response = await axios.get<IMetadata<IMerchantResponse>>(
      `${this.config.get('WOMPI_ENVIRONMENT')}/merchants/${this.config.get('WOMPI_PUBLIC_KEY')}`,
    );
    return response?.data?.data.presigned_acceptance?.acceptance_token;
  }
}
