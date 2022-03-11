import { CanActivate, ExecutionContext, mixin } from "@nestjs/common";
import { Role } from "../../users/user.model";

export const RolesGuard = (...roles: Role[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();

      return roles.some((role) => req.user.role === role);
    }
  }

  return <any>mixin(RolesGuardMixin);
};
