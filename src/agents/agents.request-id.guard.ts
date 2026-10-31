import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AgentsRequestIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.agentsRequestId = uuidv4();

    return true;
  }
}
