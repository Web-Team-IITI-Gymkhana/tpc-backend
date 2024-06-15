import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { RoleEnum } from "src/enums";

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly role: RoleEnum = RoleEnum.ADMIN;
  constructor(role: RoleEnum) {
    this.role = role;
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.user.role && (request.user.role === this.role || request.user.role === RoleEnum.ADMIN)) {
      return true;
    }

    return false;
  }
}
