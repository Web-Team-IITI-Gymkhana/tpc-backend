import { NestedEnum, NestedNumber, NestedObject } from "src/decorators/dto";
import { DepartmentEnum, SeasonTypeEnum, OrderByEnum } from "src/enums";
import { createMatchOptionsEnum, MatchOptionsBool, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

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

class FilterRegistrationsDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: FilterStudentDto, optional: true })
  student?: FilterStudentDto;

  @NestedObject({ type: FilterSeasonDto, optional: true })
  season?: FilterSeasonDto;

  @NestedObject({ type: MatchOptionsBool, optional: true })
  registered?: MatchOptionsBool;
}

class OrderSeasonDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  year?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  type?: OrderByEnum;
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

class OrderRegistrationsDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedObject({ type: OrderStudentDto, optional: true })
  student?: OrderStudentDto;

  @NestedObject({ type: OrderSeasonDto, optional: true })
  season?: OrderSeasonDto;

  @NestedEnum(OrderByEnum, { optional: true })
  registered?: OrderByEnum;
}

export class RegistrationsQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterRegistrationsDto, optional: true })
  filterBy?: FilterRegistrationsDto;

  @NestedObject({ type: OrderRegistrationsDto, optional: true })
  orderBy?: OrderRegistrationsDto;
}
