import { Inject, Injectable } from '@nestjs/common';
import { IUser } from 'src/domain/entities/User';
import {
  USER_REPOSITORY,
  type UserRepository,
} from 'src/domain/ports/user.repository';
import { EMAIL_REGEX } from 'src/shared/regex.constants';

@Injectable()
export class CreateUser {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repo: UserRepository,
  ) {}

  async execute({ email, name }: IUser): Promise<void> {
    if (!email || !EMAIL_REGEX.test(email)) {
      throw new Error('Missing or wrong email');
    }

    if (!name) {
      throw new Error('Missing or wrong name');
    }

    await this.repo.create({
      email,
      name,
    });
  }
}
