export interface MerchantService {
  execute(this: void): Promise<string | undefined>;
}
