import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsEnum, IsOptional, IsString, IsUUID, ValidateNested, IsArray, IsDate } from "class-validator";
import { CompanyCategoryEnum, EventTypeEnum, JobStatusTypeEnum, TpcMemberRoleEnum } from "src/enums";
import { DepartmentEnum } from "src/enums/department.enum";
import { IndustryDomainEnum } from "src/enums/industryDomains.enum";
import { JobCoordinatorRoleEnum } from "src/enums/jobCoordinatorRole";

class RegistrationReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;
}

class CompanyReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ enum: IndustryDomainEnum, isArray: true })
  @IsEnum(IndustryDomainEnum, { each: true })
  @IsArray()
  domains: IndustryDomainEnum[];

  @ApiProperty({ enum: CompanyCategoryEnum })
  @IsEnum(CompanyCategoryEnum)
  category: CompanyCategoryEnum;
}

class ApplicationReturnDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  resumeId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  eventId?: string;
}

class EventReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  roundNumber: number;

  @ApiProperty({ enum: EventTypeEnum })
  @IsEnum(EventTypeEnum)
  type: EventTypeEnum;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  metadata?: string;

  @ApiProperty({ type: Date })
  @IsDate()
  startDateTime: Date;

  @ApiProperty({ type: Date })
  @IsDate()
  endDateTime: Date;
}

class UserReturnDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  contact: string;
}

class TpcMemberReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ enum: DepartmentEnum })
  @IsEnum(DepartmentEnum)
  department: DepartmentEnum;

  @ApiProperty({ enum: TpcMemberRoleEnum })
  @IsEnum(TpcMemberRoleEnum)
  role: TpcMemberRoleEnum;

  @ApiProperty({ type: UserReturnDto })
  @ValidateNested()
  @Type(() => UserReturnDto)
  user: UserReturnDto;
}

class JobCoordinatorsReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ enum: JobCoordinatorRoleEnum })
  @IsEnum(JobCoordinatorRoleEnum)
  role: JobCoordinatorRoleEnum;

  @ApiProperty({ type: TpcMemberReturnDto })
  @ValidateNested()
  @Type(() => TpcMemberReturnDto)
  tpcMember: TpcMemberReturnDto;
}

class SeasonReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  type: string;

  @ApiProperty({ type: String })
  @IsString()
  year: string;

  @ApiProperty({ type: RegistrationReturnDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => RegistrationReturnDto)
  registrations: RegistrationReturnDto[];
}

class JobReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  role: string;

  @ApiProperty({ enum: JobStatusTypeEnum })
  @IsEnum(JobStatusTypeEnum)
  currentStatus: JobStatusTypeEnum;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  others?: string;

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

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  offerLetterReleaseDate?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @Type(() => String)
  joiningDate?: string;

  @ApiProperty({ type: CompanyReturnDto })
  @ValidateNested()
  @Type(() => CompanyReturnDto)
  company: CompanyReturnDto;

  @ApiProperty({ type: SeasonReturnDto })
  @ValidateNested()
  @Type(() => SeasonReturnDto)
  season: SeasonReturnDto;

  @ApiProperty({ type: JobCoordinatorsReturnDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => JobCoordinatorsReturnDto)
  jobCoordinators: JobCoordinatorsReturnDto[];

  @ApiProperty({ type: EventReturnDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => EventReturnDto)
  events: EventReturnDto[];

  @ApiProperty({ type: ApplicationReturnDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => ApplicationReturnDto)
  applications: ApplicationReturnDto[];
}

export class GetSalaryDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  salaryPeriod?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  others?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  baseSalary: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  totalCTC: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  takeHomeSalary: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  grossSalary: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  otherCompensations: number;

  @ApiProperty({ type: JobReturnDto })
  @ValidateNested()
  @Type(() => JobReturnDto)
  job: JobReturnDto;
}
