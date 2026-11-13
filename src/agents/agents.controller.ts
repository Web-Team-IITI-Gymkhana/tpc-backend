import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseFilters, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { AgentsChatDto } from "./dtos/post.dto";
import { AgentsExceptionFilter } from "./agents.exception-filter";
import { AgentsService } from "./agents.service";
import { User } from "src/decorators/User";
import { IUser } from "src/auth/User";

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
  @HttpCode(HttpStatus.OK)
  async chat(@Body() body: AgentsChatDto, @User() user: IUser, @Req() request) {
    const requestId = request.agentsRequestId;
    const role = this.agentsService.getServiceRole(user.role);
    const response = await this.agentsService.ask(body.query, user.id, role, requestId);
    this.agentsService.logAudit(user.id, role, requestId, body.query.length, 200, Date.now() - request.agentsStartedAt);

    return { response, request_id: requestId };
  }
}
