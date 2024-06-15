import { Module } from "@nestjs/common";
import { RecruiterViewService } from "./recruiter-view.service";
import { RecruiterViewController } from "./recruiter-view.controller";

@Module({
  controllers: [RecruiterViewController],
  providers: [RecruiterViewService],
})
export class RecruiterViewModule {}
