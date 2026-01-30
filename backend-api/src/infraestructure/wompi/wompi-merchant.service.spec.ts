import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { WompiMerchantService } from './wompi-merchant.service';

jest.mock('axios');

const getSpy = jest.spyOn(axios, 'get').mockResolvedValue({
  data: {
    data: { id: 'tx_1', status: 'PENDING' },
  },
});

describe('WompiMerchantService', () => {
  let service: WompiMerchantService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          WOMPI_ENVIRONMENT: 'https://api.wompi.test',
          WOMPI_PUBLIC_KEY: 'pub_test_123',
        };
        return config[key];
      }),
    } as unknown as jest.Mocked<ConfigService>;

    service = new WompiMerchantService(configService);
    jest.clearAllMocks();
  });

  it('should return acceptance token when response is valid', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        data: {
          presigned_acceptance: {
            acceptance_token: 'token_abc',
          },
        },
      },
    });

    const result = await service.execute();

    expect(getSpy).toHaveBeenCalledWith(
      'https://api.wompi.test/merchants/pub_test_123',
    );
    expect(result).toBe('token_abc');
  });

  it('should return undefined when acceptance token is missing', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        data: {},
      },
    });

    const result = await service.execute();

    expect(getSpy).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
