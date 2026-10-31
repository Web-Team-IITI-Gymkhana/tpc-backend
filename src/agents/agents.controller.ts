import { Body, Controller, HttpException, Post, Req, ServiceUnavailableException, UseFilters, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { AgentsRole, getAgentsRole } from "./agents.roles";
import { AgentsChatDto } from "./dtos/post.dto";
import { AgentsExceptionFilter } from "./agents.exception-filter";
import { AgentsService } from "./agents.service";
import { env } from "src/config";

@Controller("agents")
@ApiTags("Agents")
@ApiBearerAuth("jwt")
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post("chat")
  @Throttle({
    default: {
      limit: 10,
      ttl: 60 * 1000,
      getTracker: (request) => request.user?.id || request.ip,
    },
  })
  @UseGuards(AuthGuard("jwt"), ThrottlerGuard)
  @UseFilters(AgentsExceptionFilter)
  async chat(@Body() body: AgentsChatDto, @Req() request) {
    const startedAt = Date.now();
    const requestId = request.agentsRequestId;
    let auditRole: string = request.user.role;
    let status = 500;

    try {
      if (!env().AGENTS_ENABLED) throw new ServiceUnavailableException("Chatbot is currently unavailable");

      const role: AgentsRole = getAgentsRole(request.user.role);
      auditRole = role;
      const response = await this.agentsService.ask(body.query, request.user.id, role, requestId);
      status = 200;

      return { response, request_id: requestId };
    } catch (error) {
      status = error instanceof HttpException ? error.getStatus() : 503;
      throw error;
    } finally {
      this.agentsService.logAudit(
        request.user.id,
        auditRole,
        requestId,
        body.query.length,
        status,
        Date.now() - startedAt
      );
    }
  }
}
