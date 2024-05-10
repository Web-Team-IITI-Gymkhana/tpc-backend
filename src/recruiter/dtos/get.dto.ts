import { NestedEmail, NestedEnum, NestedNumber, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import { CategoryEnum, DepartmentEnum, GenderEnum, SeasonTypeEnum } from "src/enums";

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

class CompanyDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;
}

export class GetRecruitersDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  designation: string;

  @NestedString({ optional: true })
  landline?: string;

  @NestedObject({ type: UserDto })
  user: UserDto;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;
}

class SeasonDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;
}

class SalariesDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  totalCTC: number;

  @NestedString({ optional: true })
  salaryPeriod?: string;

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

  @NestedObject({ type: SalariesDto, isArray: true })
  salaries: SalariesDto[];
}

export class GetRecruiterDto extends GetRecruitersDto {
  @NestedObject({ type: JobDto, isArray: true })
  jobs: JobDto[];
}
