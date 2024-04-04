import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { JobStatusTypeEnum, SeasonTypeEnum } from "src/enums";
import { GetCompaniesReturnDto } from "src/recruiter/dtos/recruiterGetReturn.dto";
import { Type } from "class-transformer";
import { CompanyDetailsDto, RecruiterDetailsDto, SelectionProcedureDetailsDto } from "./jaf.dto";
import { omit } from "lodash";
import { GetUsersReturnDto } from "src/student/dtos/studentGetReturn.dto";
import { JobCoordinatorRoleEnum } from "src/enums/jobCoordinatorRole";
import { GetTpcMembersReturnDto } from "src/tpcMember/dtos/tpcMemberGetReturn.dto";

export class GetSeasonsReturnDto {
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

class GetJobRecruiterReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  //Remove this.
  @ApiProperty({ type: String })
  @IsUUID()
  userId: string;

  @ApiProperty({ type: GetUsersReturnDto })
  @ValidateNested()
  @Type(() => GetUsersReturnDto)
  user: GetUsersReturnDto;

  //Remove this.
  @ApiProperty({ type: String })
  @IsUUID()
  companyId: string;

  @ApiProperty({ type: String })
  @IsString()
  designation: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  landline?: string;
}

export class GetJobCoordinatorsReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsUUID()
  tpcMemberId: string;

  @ApiProperty({ enum: JobCoordinatorRoleEnum })
  @IsEnum(JobCoordinatorRoleEnum)
  role: JobCoordinatorRoleEnum;

  @ApiProperty({ type: GetTpcMembersReturnDto })
  @ValidateNested()
  @Type(() => GetTpcMembersReturnDto)
  tpcMember: GetTpcMembersReturnDto;
}

export class GetJobsReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsUUID()
  seasonId: string;

  @ApiProperty({ type: String })
  @IsUUID()
  companyId: string;

  @ApiProperty({ type: String })
  @IsUUID()
  recruiterId: string;

  @ApiProperty({ type: String })
  @IsString()
  role: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  active: boolean;

  @ApiProperty({ enum: JobStatusTypeEnum })
  @IsEnum(JobStatusTypeEnum)
  currentStatus: JobStatusTypeEnum;

  @ApiProperty({ type: GetCompaniesReturnDto })
  @ValidateNested()
  @Type(() => GetCompaniesReturnDto)
  company: GetCompaniesReturnDto;

  @ApiProperty({ type: GetSeasonsReturnDto })
  @ValidateNested()
  @Type(() => GetSeasonsReturnDto)
  season: GetSeasonsReturnDto;
}

export class GetJobReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsUUID()
  seasonId: string;

  @ApiProperty({ type: String })
  @IsUUID()
  companyId: string;

  @ApiProperty({ type: String })
  @IsUUID()
  recruiterId: string;

  @ApiProperty({ type: String })
  @IsString()
  role: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  others?: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  active: boolean;

  @ApiProperty({ enum: JobStatusTypeEnum })
  @IsEnum(JobStatusTypeEnum)
  currentStatus: JobStatusTypeEnum;

  @ApiProperty({ type: CompanyDetailsDto })
  @ValidateNested()
  @Type(() => CompanyDetailsDto)
  companyDetailsFilled: CompanyDetailsDto;

  @ApiProperty({ type: RecruiterDetailsDto })
  @ValidateNested()
  @Type(() => RecruiterDetailsDto)
  recruiterDetailsFilled: RecruiterDetailsDto;

  @ApiProperty({ type: SelectionProcedureDetailsDto })
  @ValidateNested()
  @Type(() => SelectionProcedureDetailsDto)
  selectionProcedure: SelectionProcedureDetailsDto;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  attachment?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  skills?: string;

  @ApiProperty({ type: String })
  @IsString()
  location: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  noOfVacancies?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsDateString()
  @Type(() => String)
  offerLetterReleaseDate?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsDateString()
  @Type(() => String)
  joiningDate?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ type: GetCompaniesReturnDto })
  @ValidateNested()
  @Type(() => GetCompaniesReturnDto)
  company: GetCompaniesReturnDto;

  @ApiProperty({ type: GetSeasonsReturnDto })
  @ValidateNested()
  @Type(() => GetSeasonsReturnDto)
  season: GetSeasonsReturnDto;

  @ApiProperty({ type: GetJobRecruiterReturnDto })
  @ValidateNested()
  @Type(() => GetJobRecruiterReturnDto)
  recruiter: GetJobRecruiterReturnDto;

  @ApiProperty({ type: GetJobCoordinatorsReturnDto })
  @ValidateNested()
  @Type(() => GetJobCoordinatorsReturnDto)
  jobCoordinators: GetJobCoordinatorsReturnDto;
}
