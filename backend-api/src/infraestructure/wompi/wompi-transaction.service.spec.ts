jest.mock('axios');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'uuid-mock'),
}));

import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  FindTransactionWompiService,
  GetAcceptanceTokenService,
  WompiService,
} from './wompi-transaction.service';
import { ITransactionBody } from './types/transactions';

const mockedAxios = axios as jest.Mocked<typeof axios>;

const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({
  data: {
    data: { id: 'tx_1', status: 'PENDING' },
  },
});

const getSpy = jest.spyOn(axios, 'get').mockResolvedValue({
  data: {
    data: { id: 'tx_1', status: 'PENDING' },
  },
});

describe('Wompi Services', () => {
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          WOMPI_ENVIRONMENT: 'https://api.wompi.test',
          WOMPI_PUBLIC_KEY: 'pub_test_123',
          WOMPI_INTEGRITY_KEY: 'integrity_key',
        };
        return config[key];
      }),
    } as unknown as jest.Mocked<ConfigService>;

    jest.clearAllMocks();
  });

  describe('WompiService.createTransaction', () => {
    let service: WompiService;

    beforeEach(() => {
      service = new WompiService(configService);
    });

    it('should create a transaction and return wompi transaction data', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            id: 'tx_1',
            status: 'PENDING',
          },
        },
      });

      const body = {
        amount_in_cents: 10000,
        currency: 'COP',
        payment_method: {},
      } as ITransactionBody;

      const result = await service.createTransaction(body, 1);

      expect(postSpy).toHaveBeenCalledWith(
        'https://api.wompi.test/transactions',
        expect.objectContaining({
          reference: '1_uuid-mock',
          amount_in_cents: 10000,
          currency: 'COP',
        }),
        {
          headers: {
            Authorization: 'Bearer pub_test_123',
          },
        },
      );

      expect(result).toEqual({
        id: 'tx_1',
        status: 'PENDING',
      });
    });
  });

  describe('GetAcceptanceTokenService', () => {
    let service: GetAcceptanceTokenService;

    beforeEach(() => {
      service = new GetAcceptanceTokenService(configService);
    });

    it('should return acceptance token', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          data: {
            presigned_acceptance: {
              acceptance_token: 'token_123',
            },
          },
        },
      });

      const result = await service.execute();

      expect(getSpy).toHaveBeenCalledWith(
        'https://api.wompi.test/merchants/pub_test_123',
      );
      expect(result).toBe('token_123');
    });

    it('should return undefined if token is missing', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          data: {},
        },
      });

      const result = await service.execute();
      expect(result).toBeUndefined();
    });
  });

  describe('FindTransactionWompiService', () => {
    let service: FindTransactionWompiService;

    beforeEach(() => {
      service = new FindTransactionWompiService(configService);
    });

    it('should find transaction by id', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          data: {
            id: 'tx_1',
            status: 'APPROVED',
          },
        },
      });

      const result = await service.findTransaction('tx_1');

      expect(getSpy).toHaveBeenCalledWith(
        'https://api.wompi.test/transactions/tx_1',
        {
          headers: {
            Authorization: 'Bearer pub_test_123',
          },
        },
      );

      expect(result).toEqual({
        id: 'tx_1',
        status: 'APPROVED',
      });
    });
  });
});
