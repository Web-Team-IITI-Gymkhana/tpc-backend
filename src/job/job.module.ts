import { Module } from "@nestjs/common";
import { JafController } from "./jaf.controller";
import { JafService } from "./jaf.service";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";
import { AttachmentController } from "./attachment.controller";

@Module({
  controllers: [JafController, JobController, AttachmentController],
  providers: [JafService, JobService],
})
export class JobModule {}
