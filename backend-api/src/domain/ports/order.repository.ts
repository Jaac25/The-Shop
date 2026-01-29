import { IOrder } from '../entities/Order';

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

export interface OrderRepository {
  create(order: IOrder): Promise<void>;
}
