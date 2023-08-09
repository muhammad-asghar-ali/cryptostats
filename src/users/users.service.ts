import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { User } from 'src/models/user.model';
import { CreateUserRequest } from './dto/request/create-user-request.dto';
import { UserResponse } from './dto/response/user.response.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  private buildResponse(user: User): UserResponse {
    return {
      _id: user._id.toHexString(),
      email: user.email,
    };
  }

  private async validateUserRequest(
    createUser: CreateUserRequest
  ): Promise<void> {
    const user = await this.usersRepo.findOneByEmail(createUser.email);
    if (user) {
      throw new BadRequestException('this email already exists');
    }
  }

  public async createUser(
    createUser: CreateUserRequest
  ): Promise<UserResponse> {
    await this.validateUserRequest(createUser);
    const user = await this.usersRepo.insertOne({
      ...createUser,
      password: await bcrypt.hash(createUser.password, 12),
    });

    return this.buildResponse(user);
  }

  public async updateUser(
    userId: string,
    data: Partial<User>
  ): Promise<UserResponse> {
    const user = await this.usersRepo.updateOne(userId, data);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.buildResponse(user);
  }

  public async validateUser(
    email: string,
    password: string
  ): Promise<UserResponse> {
    const user = await this.usersRepo.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credendial are invalid');
    }

    return this.buildResponse(user);
  }

  public async getUserById(userId: string): Promise<UserResponse> {
    const user = await this.usersRepo.findOneById(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.buildResponse(user);
  }
}
