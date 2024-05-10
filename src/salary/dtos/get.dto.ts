import { NestedEmail, NestedEnum, NestedNumber, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import {
  CategoryEnum,
  DepartmentEnum,
  FacultyApprovalStatusEnum,
  GenderEnum,
  OfferStatusEnum,
  SeasonTypeEnum,
} from "src/enums";

class CompanyDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;
}

class SeasonDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;
}

class JobDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: string;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;
}

export class GetSalariesDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  baseSalary: number;

  @NestedNumber({})
  totalCTC: number;

  @NestedNumber({})
  takeHomeSalary: number;

  @NestedNumber({})
  grossSalary: number;

  @NestedNumber({})
  otherCompensations: number;

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedObject({ type: JobDto })
  job: JobDto;
}

class UserDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;

  @NestedEmail({})
  email: string;

  @NestedString({})
  contact: string;
}

class FacultyDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;

  @NestedObject({ type: UserDto })
  user: UserDto;
}

class FacultyApprovalRequestsDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(FacultyApprovalStatusEnum, {})
  status: FacultyApprovalStatusEnum;

  @NestedString({ optional: true })
  remarks?: string;

  @NestedObject({ type: FacultyDto })
  faculty: FacultyDto;
}

class ProgramDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  branch: string;

  @NestedString({})
  course: string;

  @NestedString({})
  year: string;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;
}

class StudentDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  rollNo: string;

  @NestedObject({ type: UserDto })
  user: UserDto;

  @NestedObject({ type: ProgramDto })
  program: ProgramDto;
}

class OnCampusOffersDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(OfferStatusEnum, {})
  status: OfferStatusEnum;

  @NestedObject({ type: StudentDto })
  student: StudentDto;
}

export class GetSalaryDto extends GetSalariesDto {
  @NestedString({ optional: true })
  others?: string;

  @NestedEnum(GenderEnum, { isArray: true, optional: true })
  genders?: GenderEnum[];

  @NestedUUID({ isArray: true, optional: true })
  programs?: string[];

  @NestedEnum(DepartmentEnum, { isArray: true })
  facultyApprovals: DepartmentEnum[];

  @NestedEnum(CategoryEnum, { isArray: true, optional: true })
  categories?: CategoryEnum[];

  @NestedNumber({})
  minCPI: number;

  @NestedNumber({})
  tenthMarks: number;

  @NestedNumber({})
  twelthMarks: number;

  @NestedObject({ type: FacultyApprovalRequestsDto, isArray: true })
  facultyApprovalRequests: FacultyApprovalRequestsDto[];

  @NestedObject({ type: OnCampusOffersDto, isArray: true })
  onCampusOffers: OnCampusOffersDto[];
}
