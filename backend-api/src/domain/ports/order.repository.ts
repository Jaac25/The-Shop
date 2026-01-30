import { IOrder } from '../entities/Order';

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

export interface OrderRepository {
  create(this: void, order: IOrder): Promise<{ id?: string }>;
}
