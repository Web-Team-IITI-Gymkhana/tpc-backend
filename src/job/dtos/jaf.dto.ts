import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
  IsUrl,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsDateString,
  IsArray,
  IsObject,
  IsUUID,
  IsBoolean,
  IsDate,
} from "class-validator";
import { SeasonTypeEnum, GenderEnum, CategoryEnum, CompanyCategoryEnum } from "src/enums";
import { CountriesEnum } from "src/enums/Country.enum";
import { DepartmentEnum } from "src/enums/department.enum";
import { IndustryDomainEnum } from "src/enums/industryDomains.enum";
import { InterviewTypesEnum } from "src/enums/interviewTypes.enum";
import { SelectionModeEnum } from "src/enums/selectionMode.enum";
import { TestTypesEnum } from "src/enums/testTypes.enum";

export class AddressDto {
  @ApiProperty({ type: String })
  @IsString()
  line1: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  line2?: string;

  @ApiProperty({ type: String })
  @IsString()
  city: string;

  @ApiProperty({ type: String })
  @IsString()
  state: string;

  @ApiProperty({ type: String })
  @IsString()
  zipCode: string;

  @ApiProperty({ enum: CountriesEnum })
  @IsEnum(CountriesEnum)
  country: CountriesEnum;
}

export class CompanyDetailsDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({
    enum: IndustryDomainEnum,
    isArray: true,
  })
  @IsOptional()
  @IsEnum(IndustryDomainEnum, { each: true })
  domains?: IndustryDomainEnum[];

  @ApiProperty({
    enum: CompanyCategoryEnum,
  })
  @IsEnum(CompanyCategoryEnum)
  category: CompanyCategoryEnum;

  @ApiProperty({
    type: AddressDto,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  yearOfEstablishment: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  annualTurnover?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  socialMediaLink?: string;
}

export class RecruiterDetailsDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  designation: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  contact: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  landline?: string;
}

export class EligibilityDetailsDto {
  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  @IsUUID("all", { each: true })
  programs?: string[];

  @ApiPropertyOptional({ enum: GenderEnum, isArray: true })
  @IsArray()
  @IsOptional()
  @IsEnum(GenderEnum, { each: true })
  genders?: GenderEnum[];

  @ApiPropertyOptional({ enum: CategoryEnum, isArray: true })
  @IsArray()
  @IsOptional()
  @IsEnum(CategoryEnum, { each: true })
  categories?: CategoryEnum[];

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minCPI?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  tenthMarks?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  twelthMarks?: number;

  facultyApprovals?: DepartmentEnum[];
}

export class RequirementsDetailsDto {
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  numberOfMembers?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  numberOfRooms?: number;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  otherRequirements?: string;
}

export class TestDetailsDto {
  @ApiProperty({ enum: TestTypesEnum })
  @IsEnum(TestTypesEnum)
  type: TestTypesEnum;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  duration?: number;
}

export class InterviewDetailsDto {
  @ApiProperty({ enum: InterviewTypesEnum })
  @IsEnum(InterviewTypesEnum)
  type: InterviewTypesEnum;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  duration?: number;
}

export class SelectionProcedureDetailsDto {
  @ApiProperty({ enum: SelectionModeEnum })
  @IsEnum(SelectionModeEnum)
  selectionMode: SelectionModeEnum;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  shortlistFromResume: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  groupDiscussion: boolean;

  @ApiProperty({ type: [TestDetailsDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestDetailsDto)
  tests: TestDetailsDto[];

  @ApiProperty({ type: [InterviewDetailsDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterviewDetailsDto)
  interviews: InterviewDetailsDto[];

  @ApiPropertyOptional({ type: RequirementsDetailsDto })
  @ValidateNested({ each: true })
  @Type(() => RequirementsDetailsDto)
  @IsOptional()
  requirements?: RequirementsDetailsDto;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  others?: string;
}

export class SalaryDetailsDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  salaryPeriod?: string;

  @ApiProperty({ type: EligibilityDetailsDto })
  @ValidateNested({ each: true })
  @Type(() => EligibilityDetailsDto)
  criteria: EligibilityDetailsDto;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Type(() => Number)
  baseSalary: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Type(() => Number)
  totalCTC: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Type(() => Number)
  takeHomeSalary: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Type(() => Number)
  grossSalary: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Type(() => Number)
  otherCompensations: number;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  others?: string;
}

export class JobDetailsDto {
  @ApiProperty({
    type: String,
  })
  @IsUUID()
  seasonId: string;

  recruiterId: string;
  companyId: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  role: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  others?: string;

  @ApiProperty({ type: CompanyDetailsDto })
  @ValidateNested({ each: true })
  @Type(() => CompanyDetailsDto)
  companyDetailsFilled: CompanyDetailsDto;

  @ApiProperty({ type: RecruiterDetailsDto })
  @ValidateNested({ each: true })
  @Type(() => RecruiterDetailsDto)
  recruiterDetailsFilled: RecruiterDetailsDto;

  @ApiProperty({ type: SelectionProcedureDetailsDto })
  @ValidateNested({ each: true })
  @Type(() => SelectionProcedureDetailsDto)
  selectionProcedure: SelectionProcedureDetailsDto;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  description?: string;

  attachment?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  skills?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  location: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  noOfVacancies?: number;

  @ApiPropertyOptional({
    type: Date,
  })
  @IsOptional()
  @IsDateString()
  offerLetterReleaseDate?: string;

  @ApiPropertyOptional({
    type: Date,
  })
  @IsOptional()
  @IsDateString()
  joiningDate?: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  duration?: number;
}

export class CreateJafDto {
  @ApiProperty({
    type: JobDetailsDto,
  })
  @ValidateNested()
  @Type(() => JobDetailsDto)
  job: JobDetailsDto;

  @ApiProperty({
    type: SalaryDetailsDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => SalaryDetailsDto)
  salaries: SalaryDetailsDto[];
}
