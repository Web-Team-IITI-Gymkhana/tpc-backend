import { Module } from "@nestjs/common";
import { AgentsController } from "./agents.controller";
import { AgentsEnabledGuard } from "./agents.enabled.guard";
import { AgentsRequestIdGuard } from "./agents.request-id.guard";
import { AgentsService } from "./agents.service";
import { AgentsThrottlerGuard } from "./agents.throttler.guard";

@Module({
  controllers: [AgentsController],
  providers: [AgentsEnabledGuard, AgentsRequestIdGuard, AgentsService, AgentsThrottlerGuard],
})
export class AgentsModule {}
