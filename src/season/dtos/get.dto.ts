import { NestedEnum, NestedString, NestedUUID } from "src/decorators/dto";
import { SeasonTypeEnum } from "src/enums";

export class GetSeasonsDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;
}
