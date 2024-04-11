import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CompanyReturnDto, SeasonReturnDto } from "./getOff.dto";
import { Type } from "class-transformer";
import { OfferStatusEnum } from "src/enums/offerStatus.enum";

class JobReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  role: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  others?: string;

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

export class OnCampusOfferReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ enum: OfferStatusEnum })
  @IsEnum(OfferStatusEnum)
  status: OfferStatusEnum;

  @ApiProperty({ type: SalaryReturnDto })
  @ValidateNested()
  @Type(() => SalaryReturnDto)
  salary: SalaryReturnDto;
}
