import { CanActivate, ExecutionContext, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { env } from "src/config";

@Injectable()
export class AgentsEnabledGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    if (!env().AGENTS_ENABLED) throw new ServiceUnavailableException("Chatbot is currently unavailable");

    return true;
  }
}
