import { IUser } from '../entities/User';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserRepository {
  create(user: IUser): Promise<void>;
}
