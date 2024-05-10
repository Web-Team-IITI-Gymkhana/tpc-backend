import { NestedEnum, NestedNumber, NestedObject } from "src/decorators/dto";
import { JobStatusTypeEnum, SeasonTypeEnum, OrderByEnum } from "src/enums";
import {
  createMatchOptionsEnum,
  MatchOptionsBool,
  MatchOptionsNumber,
  MatchOptionsString,
  MatchOptionsUUID,
} from "src/utils/utils.dto";

const jobStatusTypeEnum = createMatchOptionsEnum(JobStatusTypeEnum);
const seasonTypeEnum = createMatchOptionsEnum(SeasonTypeEnum);

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

class FilterUserDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  name?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  email?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  contact?: MatchOptionsString;
}

class OrderUserDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  name?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  email?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  contact?: OrderByEnum;
}

class FilterRecruiterDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  designation?: MatchOptionsString;

  @NestedObject({ type: FilterUserDto, optional: true })
  user?: FilterUserDto;
}

class OrderRecuiterDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  designation?: OrderByEnum;

  @NestedObject({ type: OrderUserDto, optional: true })
  user?: OrderUserDto;
}

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

class FilterJobsDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  role?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsBool, optional: true })
  active?: MatchOptionsBool;

  @NestedObject({ type: jobStatusTypeEnum, optional: true })
  currentStatus?: typeof jobStatusTypeEnum;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  noOfVacancies?: MatchOptionsNumber;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  duration?: MatchOptionsNumber;

  @NestedObject({ type: MatchOptionsString, optional: true })
  location?: MatchOptionsString;

  @NestedObject({ type: FilterCompanyDto, optional: true })
  company?: FilterCompanyDto;

  @NestedObject({ type: FilterSeasonDto, optional: true })
  season?: FilterSeasonDto;

  @NestedObject({ type: FilterRecruiterDto, optional: true })
  recruiter?: FilterRecruiterDto;
}

class OrderJobsDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  role?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  active?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  currentStatus?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  duration?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  location?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  noOfVacancies?: OrderByEnum;

  @NestedObject({ type: OrderCompanyDto, optional: true })
  company?: OrderCompanyDto;

  @NestedObject({ type: OrderSeasonDto, optional: true })
  season?: OrderSeasonDto;

  @NestedObject({ type: OrderRecuiterDto, optional: true })
  recruiter?: OrderRecuiterDto;
}

export class JobsQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterJobsDto, optional: true })
  filterBy?: FilterJobsDto;

  @NestedObject({ type: OrderJobsDto, optional: true })
  orderBy?: OrderJobsDto;
}
