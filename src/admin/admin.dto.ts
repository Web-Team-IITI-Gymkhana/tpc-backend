import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { SeasonType } from "src/db/enums";

export class AddSeasonDto {
  @ApiProperty({
    type: String,
  })
  year: string;
  @ApiProperty({
    enum: Object.values(SeasonType),
  })
  @IsEnum(SeasonType)
  type: SeasonType;
}

export class AddCompanyDto {
  @ApiProperty({
    type: String,
  })
  name: string;
}

export class AddJobDto {
  @ApiProperty()
  seasonId: string;
  @ApiProperty()
  recruiterId: string;
  @ApiProperty()
  companyId: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  metadata?: object;
}
