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
} from "class-validator";
import { SeasonType, CompanyCategory, Gender, Category } from "src/db/enums";
import { Countries } from "src/db/enums/Country.enum";
import IndustryDomain from "src/db/enums/industryDomains.enum";
import { InterviewTypes } from "src/db/enums/interviewTypes.enum";
import { SelectionMode } from "src/db/enums/selectionMode.enum";
import { TestTypes } from "src/db/enums/testTypes.enum";

export class SeasonDetailsDto {
  @ApiProperty({ type: String })
  @IsString()
  year: string;

  @ApiProperty({ enum: SeasonType })
  @IsEnum(SeasonType)
  type: SeasonType;
}

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

  @ApiProperty({ type: String })
  @IsEnum(Countries)
  country: Countries;
}

export class CompanyDetailsDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ type: "enum", enum: IndustryDomain })
  @IsEnum(IndustryDomain)
  domains: IndustryDomain[];
  //Change

  @ApiProperty({ enum: CompanyCategory })
  @IsEnum(CompanyCategory)
  category: CompanyCategory;

  @ApiProperty({ type: AddressDto })
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  size?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  yearOfEstablishment: number;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  annualTurnover?: string;

  @ApiPropertyOptional({ type: String })
  @IsUrl()
  @IsOptional()
  socialMediaLink?: string;
}

export class RecruiterDetailsDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  designation: string;

  @ApiProperty({ type: String, format: "email" })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsPhoneNumber()
  contact: string; // Include Calling code.

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  landline?: string;
}

export class EligibilityDetailsDto {
  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  programs?: string[];

  @ApiPropertyOptional({ enum: Gender, isArray: true })
  @IsArray()
  @IsOptional()
  @IsEnum(Gender, { each: true })
  genders?: Gender[];

  @ApiPropertyOptional({ enum: Category, isArray: true })
  @IsArray()
  @IsOptional()
  @IsEnum(Category, { each: true })
  categories?: Category[];

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  minCPI?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  tenthMarks?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  twelthMarks?: number;
}

export class RequirementsDetailsDto {
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  numberOfMembers?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  numberOfRooms?: number;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  otherRequirements?: string;
  //Change to string
}

export class TestDetailsDto {
  @ApiProperty({ enum: TestTypes })
  @IsEnum(TestTypes)
  type: TestTypes;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  duration?: number;
  //Change
}

export class InterviewDetailsDto {
  @ApiProperty({ enum: InterviewTypes })
  @IsEnum(InterviewTypes)
  type: InterviewTypes;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  duration?: number;
  //Change
}

export class SelectionProcedureDetailsDto {
  @ApiProperty({ enum: SelectionMode })
  @IsEnum(SelectionMode)
  selectionMode: SelectionMode;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  shortlistFromResume: boolean;
  //Change

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  groupDiscussion: boolean;
  //Change

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

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  others?: string;

  @ApiPropertyOptional({ type: RequirementsDetailsDto })
  @ValidateNested({ each: true })
  @Type(() => RequirementsDetailsDto)
  @IsOptional()
  requirements?: RequirementsDetailsDto;
}

export class SalaryDetailsDto {
  //Change Programs have been changed
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  salaryPeriod?: string;
  //Change number -> string.

  @ApiPropertyOptional({ type: EligibilityDetailsDto })
  @ValidateNested({ each: true })
  @Type(() => EligibilityDetailsDto)
  @IsOptional()
  criteria: EligibilityDetailsDto;

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

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  otherCompensations?: number;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  others?: string;
  //Change to string
}

export class JobDetailsDto {
  @ApiProperty({ type: String })
  @IsString()
  role: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  description?: string;

  //Change attachment is removed.

  @ApiProperty({ type: String })
  @IsString()
  skills: string;

  @ApiProperty({ type: String })
  @IsString()
  location: string;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  noOfVacancies?: number;

  //Change Basic Crteria Removed.

  @ApiPropertyOptional({ type: String })
  @IsDateString()
  @IsOptional()
  offerLetterReleaseDate?: string;

  @ApiPropertyOptional({ type: String })
  @IsDateString()
  @IsOptional()
  joiningDate?: string;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({ type: SelectionProcedureDetailsDto })
  @ValidateNested({ each: true })
  @Type(() => SelectionProcedureDetailsDto)
  selectionProcedure: SelectionProcedureDetailsDto;

  @ApiProperty({ type: [SalaryDetailsDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalaryDetailsDto)
  salaries: SalaryDetailsDto[];

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  others?: string;
  //Change.
}

export class CreateJafDto {
  @ApiProperty({ type: String })
  @IsUUID()
  seasonId: string;

  @ApiProperty({ type: CompanyDetailsDto })
  @ValidateNested({ each: true })
  @Type(() => CompanyDetailsDto)
  company: CompanyDetailsDto;

  @ApiProperty({ type: RecruiterDetailsDto })
  @ValidateNested({ each: true })
  @Type(() => RecruiterDetailsDto)
  recruiter: RecruiterDetailsDto;

  @ApiProperty({ type: JobDetailsDto })
  @ValidateNested({ each: true })
  @Type(() => JobDetailsDto)
  job: JobDetailsDto;
}
