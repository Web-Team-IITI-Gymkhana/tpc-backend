import { NestedEnum, NestedNumber, NestedObject } from "src/decorators/dto";
import { DepartmentEnum, FacultyApprovalStatusEnum, SeasonTypeEnum, OrderByEnum } from "src/enums";
import { createMatchOptionsEnum, MatchOptionsNumber, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

const facultyApprovalStatusEnum = createMatchOptionsEnum(FacultyApprovalStatusEnum);
const departmentEnum = createMatchOptionsEnum(DepartmentEnum);
const seasonTypeEnum = createMatchOptionsEnum(SeasonTypeEnum);

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

class FilterFacultyDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: departmentEnum, optional: true })
  department?: typeof departmentEnum;

  @NestedObject({ type: FilterUserDto, optional: true })
  user?: FilterUserDto;
}

class FilterCompanyDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  name?: MatchOptionsString;
}

class FilterSeasonDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  year?: MatchOptionsString;

  @NestedObject({ type: seasonTypeEnum, optional: true })
  type?: typeof seasonTypeEnum;
}

class FilterJobDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  role?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  joiningDate?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  offerLetterReleaseDate?: MatchOptionsString;

  @NestedObject({ type: FilterCompanyDto, optional: true })
  company?: FilterCompanyDto;

  @NestedObject({ type: FilterSeasonDto, optional: true })
  season?: FilterSeasonDto;
}

class FilterSalaryDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  salaryPeriod?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  totalCTC?: MatchOptionsNumber;

  @NestedObject({ type: FilterJobDto, optional: true })
  job?: FilterJobDto;
}

class FilterFacultyApprovalsDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: facultyApprovalStatusEnum, optional: true })
  status?: typeof facultyApprovalStatusEnum;

  @NestedObject({ type: MatchOptionsString, optional: true })
  remarks?: MatchOptionsString;

  @NestedObject({ type: FilterFacultyDto, optional: true })
  faculty?: FilterFacultyDto;

  @NestedObject({ type: FilterSalaryDto, optional: true })
  salary?: FilterSalaryDto;
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

class OrderFacultyDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  department?: OrderByEnum;

  @NestedObject({ type: OrderUserDto, optional: true })
  user?: OrderUserDto;
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

  @NestedEnum(OrderByEnum, { optional: true })
  joiningDate?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  offerLetterReleaseDate?: OrderByEnum;

  @NestedObject({ type: OrderCompanyDto, optional: true })
  company?: OrderCompanyDto;

  @NestedObject({ type: OrderSeasonDto, optional: true })
  season?: OrderSeasonDto;
}

class OrderSalaryDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  salaryPeriod?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  totalCTC?: OrderByEnum;

  @NestedObject({ type: OrderJobDto, optional: true })
  job?: OrderJobDto;
}

class OrderFacultyApprovalsDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  status?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  remarks?: OrderByEnum;

  @NestedObject({ type: OrderFacultyDto, optional: true })
  faculty?: OrderFacultyDto;

  @NestedObject({ type: OrderSalaryDto, optional: true })
  salary?: OrderSalaryDto;
}

export class FacultyApprovalsQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterFacultyApprovalsDto, optional: true })
  filterBy?: FilterFacultyApprovalsDto;

  @NestedObject({ type: OrderFacultyApprovalsDto, optional: true })
  orderBy?: OrderFacultyApprovalsDto;
}
