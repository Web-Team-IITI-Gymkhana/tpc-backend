import { Module } from "@nestjs/common";
import { ExternalOpportunitiesController } from "./externalOpportunities.controller";
import { ExternalOpportunitiesService } from "./externalOpportunities.service";

@Module({
  controllers: [ExternalOpportunitiesController],
  providers: [ExternalOpportunitiesService],
})
export class ExternalOpportunitiesModule {}
