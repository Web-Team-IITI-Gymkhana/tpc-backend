import { NestedDate, NestedString, NestedUUID, NestedEnum, NestedObject } from "src/decorators/dto";
import { OrderByEnum } from "src/enums";
import { MatchOptionsDate, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

class FilterExternalOpportunitiesDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  company?: MatchOptionsString;

  @NestedObject({ type: NestedDate, optional: true })
  lastdate?: MatchOptionsDate;
}
class OrderExternalOpportunitiesDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  company?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  lastdate?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  createdAt?: OrderByEnum;
}
export class ExternalOpportunitiesQueryDto {
  @NestedObject({ type: FilterExternalOpportunitiesDto, optional: true })
  filterBy?: FilterExternalOpportunitiesDto;

  @NestedObject({ type: OrderExternalOpportunitiesDto, optional: true })
  orderBy?: OrderExternalOpportunitiesDto;

  @NestedString({ optional: true })
  link?: string;
}
