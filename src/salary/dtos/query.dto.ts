import { NestedEnum, NestedNumber, NestedObject } from "src/decorators/dto";
import { SeasonTypeEnum, OrderByEnum } from "src/enums";
import { createMatchOptionsEnum, MatchOptionsNumber, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

const seasonTypeEnum = createMatchOptionsEnum(SeasonTypeEnum);

class FilterSeasonDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  year?: MatchOptionsString;

  @NestedObject({ type: seasonTypeEnum, optional: true })
  type?: typeof seasonTypeEnum;
}

class FilterCompanyDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  name?: MatchOptionsString;
}

class FilterJobDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  role?: MatchOptionsString;

  @NestedObject({ type: FilterCompanyDto, optional: true })
  company?: FilterCompanyDto;

  @NestedObject({ type: FilterSeasonDto, optional: true })
  season?: FilterSeasonDto;
}

class FilterSalariesDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  baseSalary?: MatchOptionsNumber;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  totalCTC?: MatchOptionsNumber;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  takeHomeSalary?: MatchOptionsNumber;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  grossSalary?: MatchOptionsNumber;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  otherCompensations?: MatchOptionsNumber;

  @NestedObject({ type: MatchOptionsString, optional: true })
  salaryPeriod?: MatchOptionsString;

  @NestedObject({ type: FilterJobDto, optional: true })
  job?: FilterJobDto;
}

class OrderCompanyDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  name?: OrderByEnum;
}

class OrderSeasonDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  year?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  type?: OrderByEnum;
}

class OrderJobDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  role?: OrderByEnum;

  @NestedObject({ type: OrderCompanyDto, optional: true })
  company?: OrderCompanyDto;

  @NestedObject({ type: OrderSeasonDto, optional: true })
  season?: OrderSeasonDto;
}

class OrderSalariesDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  baseSalary?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  totalCTC?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  takeHomeSalary?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  grossSalary?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  otherCompensations?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  salaryPeriod?: OrderByEnum;

  @NestedObject({ type: OrderJobDto, optional: true })
  job?: OrderJobDto;
}

export class SalariesQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterSalariesDto, optional: true })
  filterBy?: FilterSalariesDto;

  @NestedObject({ type: OrderSalariesDto, optional: true })
  orderBy?: OrderSalariesDto;
}
