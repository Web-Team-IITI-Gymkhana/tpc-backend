import { Module } from "@nestjs/common";
import { FacultyViewService } from "./faculty-view.service";
import { FacultyViewController } from "./faculty-view.controller";

@Module({
  controllers: [FacultyViewController],
  providers: [FacultyViewService],
})
export class FacultyViewModule {}
