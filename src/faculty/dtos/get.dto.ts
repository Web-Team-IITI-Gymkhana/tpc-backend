import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested, IsArray } from "class-validator";
import { SeasonTypeEnum } from "src/enums";
import { FacultyApprovalStatusEnum } from "src/enums/facultyApproval.enum";
import { GetFacultyApprovalsReturnDto } from "src/facultyApproval/dtos/facultyApprovalGetReturn.dto";
import { GetUsersReturnDto } from "src/student/dtos/studentGetReturn.dto";

export class GetFacultiesReturnDto {
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

class SeasonReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  year: string;

  @ApiProperty({ enum: SeasonTypeEnum })
  @IsEnum(SeasonTypeEnum)
  type: SeasonTypeEnum;
}

class CompanyReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;
}

class JobReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  role: string;

  @ApiProperty({ type: CompanyReturnDto })
  @ValidateNested()
  @Type(() => CompanyReturnDto)
  company: CompanyReturnDto;

  @ApiProperty({ type: SeasonReturnDto })
  @ValidateNested()
  @Type(() => SeasonReturnDto)
  season: SeasonReturnDto;
}

class SalaryReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  totalCTC: number;

  @ApiProperty({ type: JobReturnDto })
  @ValidateNested()
  @Type(() => JobReturnDto)
  job: JobReturnDto;
}

class FacultyApprovalReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ enum: FacultyApprovalStatusEnum })
  @IsEnum(FacultyApprovalStatusEnum)
  status: FacultyApprovalStatusEnum;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiProperty({ type: SalaryReturnDto })
  @ValidateNested()
  @Type(() => SalaryReturnDto)
  salary: SalaryReturnDto;
}

export class GetFacultyReturnDto {
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

  @ApiProperty({ type: FacultyApprovalReturnDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => FacultyApprovalReturnDto)
  @IsArray()
  facultyApprovalRequests: FacultyApprovalReturnDto[];
}
