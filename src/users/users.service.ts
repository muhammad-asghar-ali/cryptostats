import { BadRequestException, Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { User } from "src/models/user.model";
import { CreateUserRequest } from "./dto/request/create-user-request.dto";
import { UserResponse } from "./dto/response/user.response.dto";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  private buildResponse(user: User): UserResponse {
    return {
      _id: user._id.toHexString(),
      email: user.email,
    };
  }

  private async validateUserRequest(createUser: CreateUserRequest): Promise<void> {
    const user = await this.usersRepo.findOneByEmail(createUser.email);
    if(user) {
        throw new BadRequestException("this email already exists");
    }
    
  }

  public async createUser(createUser: CreateUserRequest): Promise<UserResponse> {
    const user = await this.usersRepo.insertOne({
      ...createUser,
      password: await bcrypt.hash(createUser.password, 12),
    });

    return this.buildResponse(user);
  }
}
