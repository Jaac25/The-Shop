import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { CreateUser } from 'src/application/use-cases/users/CreateUser';
import { IUser } from 'src/domain/entities/User';

@Controller('users')
export class UserController {
  constructor(private readonly createUser: CreateUser) {}

  @Post()
  async create(@Body() body: Partial<IUser>) {
    try {
      await this.createUser.execute({
        email: body?.email ?? '',
        name: body?.name ?? '',
      });
      return { message: 'User created successfully' };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error creating user',
      );
    }
  }
}
