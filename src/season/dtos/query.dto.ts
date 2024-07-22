import { NestedEnum, NestedNumber, NestedObject } from "src/decorators/dto";
import { SeasonTypeEnum, OrderByEnum } from "src/enums";
import { SeasonStatusEnum } from "src/enums/SeasonStatus.enum";
import { createMatchOptionsEnum, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

const seasonTypeEnum = createMatchOptionsEnum(SeasonTypeEnum);
const seasonStatusEnum = createMatchOptionsEnum(SeasonStatusEnum);

class FilterSeasonsDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  year?: MatchOptionsString;

  @NestedObject({ type: seasonTypeEnum, optional: true })
  type?: typeof seasonTypeEnum;

  @NestedObject({ type: seasonStatusEnum, optional: true })
  status?: typeof seasonStatusEnum;
}

class OrderSeasonsDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  status: SeasonStatusEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  year?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  type?: OrderByEnum;
}

export class SeasonsQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterSeasonsDto, optional: true })
  filterBy?: FilterSeasonsDto;

  @NestedObject({ type: OrderSeasonsDto, optional: true })
  orderBy?: OrderSeasonsDto;
}
