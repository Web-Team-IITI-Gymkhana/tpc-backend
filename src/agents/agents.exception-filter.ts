import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { AgentsService } from "./agents.service";

@Catch()
export class AgentsExceptionFilter implements ExceptionFilter {
  constructor(private readonly agentsService: AgentsService) {}

  catch(error: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();
    const status = error instanceof HttpException ? error.getStatus() : HttpStatus.SERVICE_UNAVAILABLE;
    const requestId = request.agentsRequestId;
    let role: string | null = null;
    if (request.user) {
      try {
        role = this.agentsService.getServiceRole(request.user.role);
      } catch (_error) {
        role = null;
      }
    }

    this.agentsService.logAudit(
      request.user?.id || null,
      role,
      requestId,
      typeof request.body?.query === "string" ? request.body.query.length : null,
      status,
      Date.now() - request.agentsStartedAt
    );

    const messages: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: "Invalid chatbot request",
      [HttpStatus.UNAUTHORIZED]: "Unauthorized",
      [HttpStatus.FORBIDDEN]: "Forbidden",
      [HttpStatus.TOO_MANY_REQUESTS]: "Too many chatbot requests",
      [HttpStatus.BAD_GATEWAY]: "Chatbot service failed",
      [HttpStatus.SERVICE_UNAVAILABLE]: "Chatbot is currently unavailable",
      [HttpStatus.GATEWAY_TIMEOUT]: "Chatbot request timed out",
    };

    response.status(status).json({
      error: messages[status] || "Chatbot is currently unavailable",
      request_id: requestId,
    });
  }
}
