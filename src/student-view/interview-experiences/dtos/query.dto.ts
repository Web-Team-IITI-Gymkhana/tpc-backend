import { NestedEnum, NestedNumber, NestedObject } from "src/decorators/dto";
import { OrderByEnum, SeasonTypeEnum } from "src/enums";
import { createMatchOptionsEnum, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

const seasonTypeEnum = createMatchOptionsEnum(SeasonTypeEnum);

class FilterSeasonDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  year?: MatchOptionsString;

  @NestedObject({ type: seasonTypeEnum, optional: true })
  type?: typeof seasonTypeEnum;
}

class OrderSeasonDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  year?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  type?: OrderByEnum;
}

class FilterCompanyDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  name?: MatchOptionsString;
}

class OrderCompanyDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  name?: OrderByEnum;
}

class FilterIesDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  studentName?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  filename?: MatchOptionsString;

  @NestedObject({ type: FilterSeasonDto, optional: true })
  season?: FilterSeasonDto;

  @NestedObject({ type: FilterCompanyDto, optional: true })
  company?: FilterCompanyDto;
}

class OrderIesDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  studentName?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  filename?: OrderByEnum;

  @NestedObject({ type: OrderCompanyDto, optional: true })
  company?: OrderCompanyDto;

  @NestedObject({ type: OrderSeasonDto, optional: true })
  season?: OrderSeasonDto;
}

export class InterviewExperienceQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterIesDto, optional: true })
  filterBy?: FilterIesDto;

  @NestedObject({ type: OrderIesDto, optional: true })
  orderBy?: OrderIesDto;
}
