import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, IsEnum } from "class-validator";
import { FacultyApprovalStatusEnum } from "src/enums/facultyApproval.enum";

export class CreateFacultyApprovalDto {
  @ApiProperty()
  @IsUUID()
  jobId: string;

  @ApiProperty()
  @IsUUID()
  facultyId: string;

  // Define other properties as needed
}
