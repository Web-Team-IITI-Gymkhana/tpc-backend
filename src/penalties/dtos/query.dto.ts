import { NestedEnum, NestedNumber, NestedObject } from "src/decorators/dto";
import { DepartmentEnum, OrderByEnum } from "src/enums";
import { createMatchOptionsEnum, MatchOptionsNumber, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

const departmentEnum = createMatchOptionsEnum(DepartmentEnum);

class FilterUserDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  name?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  contact?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  email?: MatchOptionsString;
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

class FilterPenaltiesDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  reason?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  penalty?: MatchOptionsNumber;

  @NestedObject({ type: FilterStudentDto, optional: true })
  student?: FilterStudentDto;
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

class OrderPenaltiesDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  reason?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  penalty?: OrderByEnum;

  @NestedObject({ type: OrderStudentDto, optional: true })
  student?: OrderStudentDto;
}

export class PenaltyQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: OrderPenaltiesDto, optional: true })
  orderBy?: OrderPenaltiesDto;

  @NestedObject({ type: FilterPenaltiesDto, optional: true })
  filterBy?: FilterPenaltiesDto;
}
