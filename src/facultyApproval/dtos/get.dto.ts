import {
  NestedDate,
  NestedEmail,
  NestedEnum,
  NestedNumber,
  NestedObject,
  NestedString,
  NestedUUID,
} from "src/decorators/dto";
import { DepartmentEnum, FacultyApprovalStatusEnum, SeasonTypeEnum } from "src/enums";

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

class FacultyDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;

  @NestedObject({ type: UserDto })
  user: UserDto;
}

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

  @NestedDate({ optional: true })
  joiningDate?: Date;

  @NestedDate({ optional: true })
  offerLetterReleaseDate?: Date;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;
}

class SalaryDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({ optional: true })
  totalCTC?: number;

  @NestedNumber({ optional: true })
  stipend?: number;

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedObject({ type: JobDto })
  job: JobDto;
}

export class GetFacultyApprovalsDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(FacultyApprovalStatusEnum, {})
  status: FacultyApprovalStatusEnum;

  @NestedString({ optional: true })
  remarks?: string;

  @NestedObject({ type: FacultyDto })
  faculty: FacultyDto;

  @NestedObject({ type: SalaryDto })
  salary: SalaryDto;
}
