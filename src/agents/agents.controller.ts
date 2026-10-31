import { Body, Controller, Post, Req, ServiceUnavailableException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { getAgentsRole } from "./agents.roles";
import { AgentsChatDto } from "./agents.dto";
import { AgentsEnabledGuard } from "./agents.enabled.guard";
import { AgentsRequestIdGuard } from "./agents.request-id.guard";
import { AgentsThrottlerGuard } from "./agents.throttler.guard";

@Controller("agents")
@ApiTags("Agents")
@ApiBearerAuth("jwt")
export class AgentsController {
  @Post("chat")
  @Throttle({ default: { limit: 10, ttl: 60 * 1000 } })
  @UseGuards(AgentsRequestIdGuard, AgentsEnabledGuard, AuthGuard("jwt"), AgentsThrottlerGuard)
  async chat(@Body() _body: AgentsChatDto, @Req() request) {
    getAgentsRole(request.user.role);
    throw new ServiceUnavailableException("Chatbot is currently unavailable");
  }
}
