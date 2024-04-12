import { Module } from "@nestjs/common";
import { JafController } from "./jaf.controller";
import { JafService } from "./jaf.service";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";

@Module({
  controllers: [JafController, JobController],
  providers: [JafService, JobService],
})
export class JobModule {}
