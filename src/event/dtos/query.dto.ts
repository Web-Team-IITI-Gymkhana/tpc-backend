import { NestedEnum, NestedNumber, NestedObject } from "src/decorators/dto";
import { EventTypeEnum, SeasonTypeEnum, DepartmentEnum, OrderByEnum } from "src/enums";
import {
  createMatchOptionsEnum,
  MatchOptionsDate,
  MatchOptionsNumber,
  MatchOptionsString,
  MatchOptionsUUID,
  MatchOptionsBool,
} from "src/utils/utils.dto";

const eventTypeEnum = createMatchOptionsEnum(EventTypeEnum);
const seasonTypeEnum = createMatchOptionsEnum(SeasonTypeEnum);
const departmentEnum = createMatchOptionsEnum(DepartmentEnum);

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

class FilterEventsDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  roundNumber?: MatchOptionsNumber;

  @NestedObject({ type: eventTypeEnum, optional: true })
  type?: typeof eventTypeEnum;

  @NestedObject({ type: MatchOptionsString, optional: true })
  metadata?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsDate, optional: true })
  startDateTime?: MatchOptionsDate;

  @NestedObject({ type: MatchOptionsDate, optional: true })
  endDateTime?: MatchOptionsDate;

  @NestedObject({ type: MatchOptionsBool, optional: true })
  visibleToRecruiter?: MatchOptionsBool;

  @NestedObject({ type: FilterJobDto, optional: true })
  job?: FilterJobDto;
}

class FilterProgramDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  branch?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  course?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  year?: MatchOptionsString;

  @NestedObject({ type: departmentEnum, optional: true })
  department?: typeof departmentEnum;
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

class FilterStudentDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  rollNo?: MatchOptionsString;

  @NestedObject({ type: FilterUserDto, optional: true })
  user?: FilterUserDto;

  @NestedObject({ type: FilterProgramDto, optional: true })
  program?: FilterProgramDto;
}

class FilterResumeDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  filepath?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsBool, optional: true })
  verified?: MatchOptionsBool;
}

class FilterApplicationsDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: FilterStudentDto, optional: true })
  student?: FilterStudentDto;

  @NestedObject({ type: FilterResumeDto, optional: true })
  resume?: FilterResumeDto;
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

class OrderEventsDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  roundNumber?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  type?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  metadata?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  startDateTime?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  endDateTime?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  visibleToRecruiter?: OrderByEnum;

  @NestedObject({ type: OrderJobDto, optional: true })
  job?: OrderJobDto;
}

class OrderResumeDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  filepath?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  verified?: OrderByEnum;
}

class OrderProgramDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  branch?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  course?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  year?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  department?: OrderByEnum;
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

class OrderStudentDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  rollNo?: OrderByEnum;

  @NestedObject({ type: OrderUserDto, optional: true })
  user?: OrderUserDto;

  @NestedObject({ type: OrderProgramDto, optional: true })
  program?: OrderProgramDto;
}

class OrderApplicationsDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedObject({ type: OrderStudentDto, optional: true })
  student?: OrderStudentDto;

  @NestedObject({ type: OrderResumeDto, optional: true })
  resume?: OrderResumeDto;
}

export class EventsQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterEventsDto, optional: true })
  filterBy?: FilterEventsDto;

  @NestedObject({ type: OrderEventsDto, optional: true })
  orderBy?: OrderEventsDto;
}

export class ApplicationsQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterApplicationsDto, optional: true })
  filterBy?: FilterApplicationsDto;

  @NestedObject({ type: OrderApplicationsDto, optional: true })
  orderBy?: OrderApplicationsDto;
}
