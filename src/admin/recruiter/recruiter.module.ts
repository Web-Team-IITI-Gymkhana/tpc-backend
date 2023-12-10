import { Module } from "@nestjs/common";
import { RecruiterController } from "./recruiter.controller";
import { RecruiterService } from "./recruiter.service";
import { DatabaseModule } from "../../db/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [RecruiterController],
  providers: [RecruiterService],
})
export class RecruiterModule {}
