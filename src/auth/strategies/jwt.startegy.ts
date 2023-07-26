import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-local";
import { UserResponse, UsersService } from "src/users";
import { TokenPayload } from "../interfaces";

@Injectable()
export class JwtStartegy extends PassportStrategy(Strategy) {
  constructor(
    _configSvc: ConfigService,
    private readonly _userSvc: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: _configSvc.get("JWT_SECRET"),
    });
  }

  async validate(payload: TokenPayload): Promise<UserResponse> {
    return this._userSvc.getUserById(payload.userId);
  }
}
