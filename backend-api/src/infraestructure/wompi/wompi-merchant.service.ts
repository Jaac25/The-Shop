import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IMetadata } from './types/common';
import { IMerchantResponse } from './types/merchants/[publicKey]';
import { MerchantService } from 'src/domain/ports/MerchantService.repository';

@Injectable()
export class WompiMerchantService implements MerchantService {
  constructor(private readonly config: ConfigService) {}

  async execute(): Promise<string | undefined> {
    const response = await axios.get<IMetadata<IMerchantResponse>>(
      `${this.config.get('WOMPI_ENVIRONMENT')}/merchants/${this.config.get('WOMPI_PUBLIC_KEY')}`,
    );
    return response?.data?.data.presigned_acceptance?.acceptance_token;
  }
}
