import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AgentsController } from "./agents.controller";
import { AgentsExceptionFilter } from "./agents.exception-filter";
import { AgentsService } from "./agents.service";
import { AgentsRequestIdMiddleware } from "./agents-request-id.middleware";

@Module({
  controllers: [AgentsController],
  providers: [AgentsExceptionFilter, AgentsRequestIdMiddleware, AgentsService],
})
export class AgentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AgentsRequestIdMiddleware).forRoutes(AgentsController);
  }
}
