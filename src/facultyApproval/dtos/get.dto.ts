import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsUUID, IsString, ValidateNested, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { FacultyApprovalStatusEnum } from "src/enums/facultyApproval.enum";
import { GetUsersReturnDto } from "src/student/dtos/studentGetReturn.dto";
import { GetSeasonsReturnDto } from "src/job/dtos/jobGetReturn.dto";
import { GetCompaniesReturnDto } from "src/recruiter/dtos/recruiterGetReturn.dto";

class FacultyReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  department: string;

  @ApiProperty({ type: GetUsersReturnDto })
  @ValidateNested()
  @Type(() => GetUsersReturnDto)
  user: GetUsersReturnDto;
}

class JobReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  role: string;

  @ApiProperty({ type: GetSeasonsReturnDto })
  @ValidateNested()
  @Type(() => GetSeasonsReturnDto)
  season: GetSeasonsReturnDto;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  joiningDate?: string;

  @ApiProperty({ type: GetCompaniesReturnDto })
  @ValidateNested()
  @Type(() => GetCompaniesReturnDto)
  company: GetCompaniesReturnDto;
}

class SalaryReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  totalCTC: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  salaryPeriod?: string;

  @ApiProperty({ type: JobReturnDto })
  @ValidateNested()
  @Type(() => JobReturnDto)
  job: JobReturnDto;
}

export class GetFacultyApprovalsDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ enum: FacultyApprovalStatusEnum })
  @IsEnum(FacultyApprovalStatusEnum)
  status: FacultyApprovalStatusEnum;

  @ApiProperty({ type: FacultyReturnDto })
  @ValidateNested()
  @Type(() => FacultyReturnDto)
  faculty: FacultyReturnDto;

  @ApiProperty({ type: SalaryReturnDto })
  @ValidateNested()
  @Type(() => SalaryReturnDto)
  salary: SalaryReturnDto;
}
