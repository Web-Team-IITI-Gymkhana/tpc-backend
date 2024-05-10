import { NestedEnum, NestedNumber, NestedObject } from "src/decorators/dto";
import { DepartmentEnum, OfferStatusEnum, OrderByEnum, SeasonTypeEnum } from "src/enums";
import { createMatchOptionsEnum, MatchOptionsNumber, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

const departmentEnum = createMatchOptionsEnum(DepartmentEnum);
const seasonTypeEnum = createMatchOptionsEnum(SeasonTypeEnum);
const offerStatusEnum = createMatchOptionsEnum(OfferStatusEnum);

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

class FilterStudentDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  rollNo?: MatchOptionsString;

  @NestedObject({ type: FilterProgramDto, optional: true })
  program?: FilterProgramDto;

  @NestedObject({ type: FilterUserDto, optional: true })
  user?: FilterUserDto;
}

class OrderStudentDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  rollNo?: OrderByEnum;

  @NestedObject({ type: OrderProgramDto, optional: true })
  program?: OrderProgramDto;

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

class FilterOffCampusOffersDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsNumber, optional: true })
  salary?: MatchOptionsNumber;

  @NestedObject({ type: MatchOptionsString, optional: true })
  salaryPeriod?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  role?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  metadata?: MatchOptionsString;

  @NestedObject({ type: offerStatusEnum, optional: true })
  status?: typeof offerStatusEnum;

  @NestedObject({ type: FilterStudentDto, optional: true })
  student?: FilterStudentDto;

  @NestedObject({ type: FilterCompanyDto, optional: true })
  company?: FilterCompanyDto;

  @NestedObject({ type: FilterSeasonDto, optional: true })
  season?: FilterSeasonDto;
}

class OrderOffCampusOffersDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  salary?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  salaryPeriod?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  metadata?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  role?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  status?: OrderByEnum;

  @NestedObject({ type: OrderCompanyDto, optional: true })
  company?: OrderCompanyDto;

  @NestedObject({ type: OrderStudentDto, optional: true })
  student?: OrderStudentDto;

  @NestedObject({ type: OrderSeasonDto, optional: true })
  season?: OrderSeasonDto;
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

class FilterOnCampusOffersDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: MatchOptionsString, optional: true })
  metadata?: MatchOptionsString;

  @NestedObject({ type: offerStatusEnum, optional: true })
  status?: typeof offerStatusEnum;

  @NestedObject({ type: FilterStudentDto, optional: true })
  student?: FilterStudentDto;

  @NestedObject({ type: FilterSalaryDto, optional: true })
  salary?: FilterSalaryDto;
}

class OrderOnCampusOffersDto {
  @NestedEnum(OrderByEnum, { optional: true })
  id?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  metadata?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  status?: OrderByEnum;

  @NestedObject({ type: OrderStudentDto, optional: true })
  student?: OrderStudentDto;

  @NestedObject({ type: OrderSalaryDto, optional: true })
  salary?: OrderSalaryDto;
}

export class OffCampusOffersQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterOffCampusOffersDto, optional: true })
  filterBy?: FilterOffCampusOffersDto;

  @NestedObject({ type: OrderOffCampusOffersDto, optional: true })
  orderBy?: OrderOffCampusOffersDto;
}

export class OnCampusOffersQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterOnCampusOffersDto, optional: true })
  filterBy?: FilterOnCampusOffersDto;

  @NestedObject({ type: OrderOnCampusOffersDto, optional: true })
  orderBy?: OrderOnCampusOffersDto;
}
