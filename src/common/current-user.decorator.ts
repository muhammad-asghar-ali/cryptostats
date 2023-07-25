import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserResponse } from "src/users";

const getCurrentUserByContext = (context: ExecutionContext): UserResponse => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context)
);
