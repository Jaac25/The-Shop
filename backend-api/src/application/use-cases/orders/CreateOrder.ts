import { Inject, Injectable } from '@nestjs/common';
import { IOrder } from 'src/domain/entities/Order';
import type { OrderRepository } from 'src/domain/ports/order.repository';
import { ORDER_REPOSITORY } from 'src/domain/ports/order.repository';
import { NUMBER_REGEX } from 'src/shared/regex.constants';

@Injectable()
export class CreateOrder {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: OrderRepository,
  ) {}

  async execute({ idUser, idProduct }: IOrder): Promise<void> {
    if (!idUser || !NUMBER_REGEX.test(idUser)) {
      throw new Error('Missing or wrong idUser');
    }

    if (!idProduct || !NUMBER_REGEX.test(idProduct)) {
      throw new Error('Missing or wrong idProduct ');
    }

    await this.repo.create({
      idProduct,
      idUser,
    });
  }
}
