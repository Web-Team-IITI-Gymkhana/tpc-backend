import { NestedEnum, NestedString, NestedUUID } from "src/decorators/dto";
import { SeasonTypeEnum } from "src/enums";
import { SeasonStatusEnum } from "src/enums/SeasonStatus.enum";

export class GetSeasonsDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;

  @NestedEnum(SeasonStatusEnum, {})
  status: SeasonStatusEnum;

  @NestedString({ optional: true })
  policyDocument?: string;
}
