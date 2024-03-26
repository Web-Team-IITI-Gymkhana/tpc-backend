import { Module } from "@nestjs/common";
import { RecruiterController } from "./recruiter.controller";
import { RecuiterService } from "./recruiter.service";

@Module({
  controllers: [RecruiterController],
  providers: [RecuiterService],
})
export class RecruiterModule {}
