import { Module } from "@nestjs/common";
import { InterviewExperienceController } from "./ie.controller";
import { InterviewExperienceService } from "./ie.service";

@Module({
  controllers: [InterviewExperienceController],
  providers: [InterviewExperienceService],
})
export class InterviewExperienceModule {}
