import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/constants";
import { RoleEnum } from "src/enums";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if (user.role === RoleEnum.TPC_MEMBER) {
      return requiredRoles.includes(RoleEnum.TPC_MEMBER) || requiredRoles.includes(RoleEnum.STUDENT);
    } else {
      return requiredRoles.includes(user.role);
    }
  }
}
