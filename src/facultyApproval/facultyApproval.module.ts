import { Module } from "@nestjs/common";
import { FacultyApprovalController } from "./facultyApproval.controller";
import { FacultyApprovalService } from "./facultyApproval.service";

@Module({
  controllers: [FacultyApprovalController],
  providers: [FacultyApprovalService],
})
export class FacultyApprovalModule {}
