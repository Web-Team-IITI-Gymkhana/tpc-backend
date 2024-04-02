import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsString, IsUUID, ValidateNested } from "class-validator";
import { SeasonTypeEnum } from "src/enums";
import { GetCompaniesReturnDto } from "src/recruiter/dtos/recruiterGetReturn.dto";

export class GetSeasonsReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  year: string;

  @ApiProperty({
    enum: SeasonTypeEnum,
  })
  @IsEnum(SeasonTypeEnum)
  type: SeasonTypeEnum;
}

export class GetJobsReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  role: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  currentStatus: string;

  @ApiProperty({
    type: GetCompaniesReturnDto,
  })
  @ValidateNested()
  @Type(() => GetCompaniesReturnDto)
  company: GetCompaniesReturnDto;

  @ApiProperty({
    type: GetSeasonsReturnDto,
  })
  @ValidateNested()
  @Type(() => GetSeasonsReturnDto)
  season: GetSeasonsReturnDto;
}
