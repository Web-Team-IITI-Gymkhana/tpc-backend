import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsUUID, IsEnum, IsString, IsEmail, ValidateNested, IsOptional, IsBoolean } from "class-validator";
import { FacultyApprovalStatusEnum } from "src/enums/facultyApproval.enum";
import { GetUsersReturnDto } from "src/student/dtos/studentGetReturn.dto";

export class GetFacultyReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: GetUsersReturnDto })
  @ValidateNested()
  @Type(() => GetUsersReturnDto)
  user: GetUsersReturnDto;

  @ApiProperty({ type: String })
  @IsString()
  department: string;
}

export class GetFacultyApprovalsReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: GetFacultyReturnDto })
  @ValidateNested()
  @Type(() => GetFacultyReturnDto)
  faculty: GetFacultyReturnDto;

  @ApiProperty({ type: String })
  @IsUUID()
  salaryId: string;

  @ApiProperty({ enum: FacultyApprovalStatusEnum, enumName: "ApprovalStatus" })
  @IsEnum(FacultyApprovalStatusEnum)
  status: FacultyApprovalStatusEnum;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  remarks?: string;
}
