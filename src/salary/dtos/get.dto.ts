import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsObject, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CategoryEnum, GenderEnum } from "src/enums";
import { DepartmentEnum } from "src/enums/department.enum";
import { GetFacultyApprovalsReturnDto } from "src/facultyApproval/dtos/facultyApprovalGetReturn.dto";

export class GetSalariesReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsUUID()
  jobId: string;

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
}

export class CriteriaDto {
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

  @ApiPropertyOptional({ enum: DepartmentEnum, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(DepartmentEnum, { each: true })
  facultyApprovals?: DepartmentEnum[];
}

export class GetSalaryReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsUUID()
  jobId: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  salaryPeriod?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  others?: string;

  @ApiProperty({ type: CriteriaDto })
  @ValidateNested()
  @Type(() => CriteriaDto)
  criteria: CriteriaDto;

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

  @ApiProperty({ type: GetFacultyApprovalsReturnDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => GetFacultyApprovalsReturnDto)
  facultyApprovalRequests: GetFacultyApprovalsReturnDto[];
}
