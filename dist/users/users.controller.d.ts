import { CreateUserRequest } from "./dto/request/create-user-request.dto";
import { UserResponse } from "./dto/response/user.response.dto";
import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    createUser(createUser: CreateUserRequest): Promise<UserResponse>;
}
