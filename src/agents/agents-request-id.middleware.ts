import { Injectable, NestMiddleware } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AgentsRequestIdMiddleware implements NestMiddleware {
  use(request: any, _response: any, next: () => void): void {
    request.agentsRequestId = uuidv4();
    next();
  }
}
