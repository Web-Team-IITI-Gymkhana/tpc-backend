import { NestedEmail, NestedEnum, NestedNumber, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import { CourseEnum, DepartmentEnum, OfferStatusEnum, SeasonTypeEnum } from "src/enums";

class UserDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;

  @NestedString({})
  contact: string;

  @NestedEmail({})
  email: string;
}

class ProgramDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  branch: string;

  @NestedEnum(CourseEnum, {})
  course: CourseEnum;

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

class SeasonDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;
}

class CompanyDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;
}

export class GetOffCampusOffersDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  salary: number;

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedString({})
  role: string;

  @NestedString({ optional: true })
  metadata?: string;

  @NestedEnum(OfferStatusEnum, {})
  status: OfferStatusEnum;

  @NestedObject({ type: StudentDto })
  student: StudentDto;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;
}

class JobDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: string;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;
}

class SalaryDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({ optional: true })
  totalCTC?: number;

  @NestedNumber({ optional: true })
  firstYearCTC?: number;

  @NestedNumber({ optional: true })
  stipend?: number;

  @NestedNumber({ optional: true })
  otherCompensations?: number;

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedObject({ type: JobDto })
  job: JobDto;
}

export class GetOnCampusOffersDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(OfferStatusEnum, {})
  status: OfferStatusEnum;

  @NestedString({ optional: true })
  metadata?: string;

  @NestedObject({ type: SalaryDto })
  salary: SalaryDto;

  @NestedObject({ type: StudentDto })
  student: StudentDto;
}
