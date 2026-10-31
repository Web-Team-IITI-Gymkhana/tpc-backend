import { Module } from "@nestjs/common";
import { AgentsController } from "./agents.controller";
import { AgentsEnabledGuard } from "./agents.enabled.guard";
import { AgentsExceptionFilter } from "./agents.exception-filter";
import { AgentsRequestIdGuard } from "./agents.request-id.guard";
import { AgentsService } from "./agents.service";
import { AgentsThrottlerGuard } from "./agents.throttler.guard";

@Module({
  controllers: [AgentsController],
  providers: [AgentsEnabledGuard, AgentsExceptionFilter, AgentsRequestIdGuard, AgentsService, AgentsThrottlerGuard],
})
export class AgentsModule {}
