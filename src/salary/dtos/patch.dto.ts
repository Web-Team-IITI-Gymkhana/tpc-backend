import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CriteriaDto } from "./get.dto";

export class UpdateSalaryDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  jobId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  salaryPeriod?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  others?: string;

  @ApiPropertyOptional({ type: CriteriaDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CriteriaDto)
  criteria?: CriteriaDto;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  baseSalary?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  totalCTC?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  takeHomeSalary?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  grossSalary?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  otherCompensations?: number;
}
