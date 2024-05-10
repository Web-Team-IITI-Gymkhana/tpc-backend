import { NestedEmail, NestedEnum, NestedNumber, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import { DepartmentEnum, SeasonTypeEnum, FacultyApprovalStatusEnum } from "src/enums";

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

export class GetFacultiesDto {
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

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;
}

class SalaryDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  totalCTC: number;

  @NestedObject({ type: JobDto })
  job: JobDto;
}

class FacultyApprovalRequestsDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(FacultyApprovalStatusEnum, {})
  status: FacultyApprovalStatusEnum;

  @NestedString({ optional: true })
  remarks?: string;

  @NestedObject({ type: SalaryDto })
  salary: SalaryDto;
}

export class GetFacultyDto extends GetFacultiesDto {
  @NestedObject({ type: FacultyApprovalRequestsDto, isArray: true })
  facultyApprovalRequests: FacultyApprovalRequestsDto[];
}
