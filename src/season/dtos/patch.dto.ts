import { NestedEnum, NestedString, NestedUUID } from "src/decorators/dto";
import { SeasonTypeEnum } from "src/enums";
import { SeasonStatusEnum } from "src/enums/SeasonStatus.enum";

export class UpdateSeasonsDto {
  @NestedUUID({})
  id: string;

  @NestedString({ optional: true })
  year?: string;

  @NestedEnum(SeasonTypeEnum, { optional: true })
  type?: SeasonTypeEnum;

  @NestedEnum(SeasonStatusEnum, { optional: true })
  status?: SeasonStatusEnum;

  @NestedString({ optional: true })
  policyDocument?: string;
}
