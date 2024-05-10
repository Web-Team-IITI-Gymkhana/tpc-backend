import { NestedEnum, NestedNumber, NestedObject } from "src/decorators/dto";
import { CompanyCategoryEnum, OrderByEnum } from "src/enums";
import { createMatchOptionsEnum, MatchOptionsNumber, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

const category = createMatchOptionsEnum(CompanyCategoryEnum);

class FilterCompaniesDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  name?: MatchOptionsString;

  @NestedObject({ type: category, optional: true })
  category?: typeof category;

  @NestedObject({ type: MatchOptionsString, optional: true })
  yearOfEstablishment?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  website?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  size?: MatchOptionsNumber;

  @NestedObject({ type: MatchOptionsString, optional: true })
  annualTurnover?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  socialMediaLink?: MatchOptionsString;
}

class OrderCompaniesDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  name?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  category?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  yearOfEstablishment?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  website?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  size?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  annualTurnover?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  socialMediaLink?: OrderByEnum;
}

export class CompanyQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterCompaniesDto, optional: true })
  filterBy?: FilterCompaniesDto;

  @NestedObject({ type: OrderCompaniesDto, optional: true })
  orderBy?: OrderCompaniesDto;
}
