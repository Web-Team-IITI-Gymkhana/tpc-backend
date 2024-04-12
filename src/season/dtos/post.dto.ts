import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsUUID } from "class-validator";
import { SeasonTypeEnum } from "src/enums";

export class CreateSeasonDto {
  @ApiProperty({ type: String })
  @IsString()
  year: string;

  @ApiProperty({ enum: SeasonTypeEnum })
  @IsEnum(SeasonTypeEnum)
  type: SeasonTypeEnum;
}
