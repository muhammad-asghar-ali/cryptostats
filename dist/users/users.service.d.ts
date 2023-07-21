import { CreateUserRequest } from "./dto/request/create-user-request.dto";
import { UserResponse } from "./dto/response/user.response.dto";
import { UsersRepository } from "./users.repository";
export declare class UsersService {
    private readonly usersRepo;
    constructor(usersRepo: UsersRepository);
    private buildResponse;
    private validateUserRequest;
    createUser(createUser: CreateUserRequest): Promise<UserResponse>;
}
