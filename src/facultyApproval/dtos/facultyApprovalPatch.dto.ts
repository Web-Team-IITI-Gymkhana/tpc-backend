import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum, IsUUID } from "class-validator";
import { FacultyApprovalStatusEnum } from "src/enums/facultyApproval.enum";

export class UpdateFacultyApprovalDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ enum: FacultyApprovalStatusEnum })
  @IsOptional()
  @IsString()
  @IsEnum(FacultyApprovalStatusEnum)
  status?: FacultyApprovalStatusEnum;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  remark?: string;
}
