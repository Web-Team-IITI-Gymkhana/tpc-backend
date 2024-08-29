import { NestedEnum, NestedNumber, NestedObject } from "src/decorators/dto";
import { DepartmentEnum, TpcMemberRoleEnum, OrderByEnum } from "src/enums";
import { createMatchOptionsEnum, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

const tpcMemberRoleEnum = createMatchOptionsEnum(TpcMemberRoleEnum);
const departmentEnum = createMatchOptionsEnum(DepartmentEnum);

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
  id: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  branch: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  course: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  year: MatchOptionsString;

  @NestedObject({ type: departmentEnum, optional: true })
  department: typeof departmentEnum;
}

class FilterStudentsDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: FilterProgramDto, optional: true })
  program?: FilterProgramDto;

  @NestedObject({ type: FilterUserDto, optional: true })
  user?: FilterUserDto;
}

class FilterTpcMembersDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: tpcMemberRoleEnum, optional: true })
  role?: typeof tpcMemberRoleEnum;

  @NestedObject({ type: FilterStudentsDto, optional: true })
  student?: FilterStudentsDto;
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

class OrderStudentsDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedObject({ type: OrderProgramDto, optional: true })
  program?: OrderProgramDto;

  @NestedObject({ type: OrderUserDto, optional: true })
  user?: OrderUserDto;
}

class OrderTpcMembersDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  department?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  role?: OrderByEnum;

  @NestedObject({ type: OrderStudentsDto, optional: true })
  student?: OrderStudentsDto;
}

export class TpcMembersQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterTpcMembersDto, optional: true })
  filterBy?: FilterTpcMembersDto;

  @NestedObject({ type: OrderTpcMembersDto, optional: true })
  orderBy?: OrderTpcMembersDto;
}
