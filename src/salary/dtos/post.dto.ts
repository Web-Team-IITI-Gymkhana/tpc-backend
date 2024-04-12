import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { EligibilityDetailsDto } from "src/job/dtos/jaf.dto";

export class CreateSalaryDto {
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

  @ApiProperty({ type: EligibilityDetailsDto })
  @ValidateNested()
  @Type(() => EligibilityDetailsDto)
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

  @ApiProperty({ type: Number })
  @IsNumber()
  otherCompensations: number;
}
