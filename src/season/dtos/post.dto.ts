import { ApiProperty } from "@nestjs/swagger";
import { NestedEnum, NestedString, NestedUUID } from "src/decorators/dto";
import { SeasonTypeEnum } from "src/enums";

export class CreateSeasonsDto {
  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;

  policyDocument?: string;

  @ApiProperty({ type: String, format: "binary" })
  policy?: string;
}
