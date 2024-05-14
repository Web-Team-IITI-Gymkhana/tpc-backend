import { NestedEnum, NestedNumber, NestedObject } from "src/decorators/dto";
import { DepartmentEnum, OrderByEnum } from "src/enums";
import { createMatchOptionsEnum, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

const departmentEnum = createMatchOptionsEnum(DepartmentEnum);

class FilterProgramsDto {
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

class OrderProgramsDto {
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

export class ProgramsQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterProgramsDto, optional: true })
  filterBy?: FilterProgramsDto;

  @NestedObject({ type: OrderProgramsDto, optional: true })
  orderBy?: OrderProgramsDto;
}
