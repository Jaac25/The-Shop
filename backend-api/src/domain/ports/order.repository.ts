import { Order } from '../entities/Order';

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

export interface OrderRepository {
  create(order: Order): Promise<void>;
}
