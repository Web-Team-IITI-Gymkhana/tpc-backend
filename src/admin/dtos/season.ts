import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { SeasonType } from "src/db/enums";

export class AddSeasonDto {
  @ApiProperty({
    type: String,
  })
  year: string;
  @ApiProperty({
    enum: SeasonType,
  })
  @IsEnum(SeasonType)
  type: SeasonType;
}
