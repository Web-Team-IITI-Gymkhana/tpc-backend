import { Injectable, NestMiddleware } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { env } from "src/config";
import { AgentsService } from "./agents.service";

@Injectable()
export class AgentsRequestIdMiddleware implements NestMiddleware {
  constructor(private readonly agentsService: AgentsService) {}

  use(request: any, response: any, next: () => void): void {
    request.agentsRequestId = uuidv4();
    request.agentsStartedAt = Date.now();

    if (!env().AGENTS_ENABLED) {
      this.agentsService.logAudit(
        null,
        null,
        request.agentsRequestId,
        typeof request.body?.query === "string" ? request.body.query.length : null,
        503,
        0
      );
      response.status(503).json({ error: "Chatbot is currently unavailable", request_id: request.agentsRequestId });

      return;
    }

    next();
  }
}
