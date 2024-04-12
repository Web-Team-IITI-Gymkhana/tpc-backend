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
import { JobStatusTypeEnum } from "src/enums";
import { SelectionProcedureDetailsDto } from "./jaf.dto";
import { Type } from "class-transformer";

export class UpdateJobDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  seasonId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  recruiterId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  others?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ enum: JobStatusTypeEnum })
  @IsOptional()
  @IsEnum(JobStatusTypeEnum)
  currentStatus?: JobStatusTypeEnum;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  attachment?: string; //Make the file using the file controller and update the attchment link.

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  skills?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
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

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({ type: SelectionProcedureDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SelectionProcedureDetailsDto)
  selectionProcedure?: SelectionProcedureDetailsDto;
}
