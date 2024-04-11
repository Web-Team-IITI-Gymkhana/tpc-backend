import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { SeasonTypeEnum } from "src/enums";

export class GetSalariesReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  salaryId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  totalCTC: number;

  @ApiProperty({ type: String })
  @IsUUID()
  jobId: string;

  @ApiProperty({ type: String })
  @IsString()
  role: string;

  @ApiProperty({ type: String })
  @IsUUID()
  seasonId: string;

  @ApiProperty({ enum: SeasonTypeEnum })
  @IsEnum(SeasonTypeEnum)
  seasonType: SeasonTypeEnum;

  @ApiProperty({ type: String })
  @IsString()
  year: string;

  @ApiProperty({ type: String })
  @IsUUID()
  registrationId: string;

  @ApiProperty({ type: String })
  @IsUUID()
  companyId: string;

  @ApiProperty({ type: String })
  @IsString()
  companyName: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  applicationId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  resumeId?: string;
}
