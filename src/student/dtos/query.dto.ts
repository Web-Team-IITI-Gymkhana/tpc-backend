import { NestedEnum, NestedNumber, NestedObject } from "src/decorators/dto";
import { CategoryEnum, DepartmentEnum, GenderEnum, OrderByEnum } from "src/enums";
import { createMatchOptionsEnum, MatchOptionsNumber, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

const categoryEnum = createMatchOptionsEnum(CategoryEnum);
const genderEnum = createMatchOptionsEnum(GenderEnum);
const departmentEnum = createMatchOptionsEnum(DepartmentEnum);

class FilterUserDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  name: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  email: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  contact: MatchOptionsString;
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

  @NestedObject({ type: MatchOptionsString, optional: true })
  rollNo?: MatchOptionsString;

  @NestedObject({ type: categoryEnum, optional: true })
  category?: typeof categoryEnum;

  @NestedObject({ type: genderEnum, optional: true })
  gender?: typeof genderEnum;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  cpi?: MatchOptionsNumber;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  tenthMarks?: MatchOptionsNumber;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  twelthMarks?: MatchOptionsNumber;

  @NestedObject({ type: FilterProgramDto, optional: true })
  program?: FilterProgramDto;

  @NestedObject({ type: FilterUserDto, optional: true })
  user?: FilterUserDto;
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

  @NestedEnum(OrderByEnum, { optional: true })
  rollNo?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  category?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  gender?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  cpi?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  tenthMarks?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  twelthMarks?: OrderByEnum;

  @NestedObject({ type: OrderProgramDto, optional: true })
  program?: OrderProgramDto;

  @NestedObject({ type: OrderUserDto, optional: true })
  user?: OrderUserDto;
}

export class StudentsQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterStudentsDto, optional: true })
  filterBy?: FilterStudentsDto;

  @NestedObject({ type: OrderStudentsDto, optional: true })
  orderBy?: OrderStudentsDto;
}
