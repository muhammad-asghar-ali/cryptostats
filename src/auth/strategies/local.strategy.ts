import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserResponse, UsersService } from "src/users";

@Injectable()
export class LocalStartegy extends PassportStrategy(Strategy) {
  constructor(private readonly _userSvc: UsersService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<UserResponse> {
    return this._userSvc.validateUser(email, password);
  }
}
