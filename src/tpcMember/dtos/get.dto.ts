import {
  NestedBoolean,
  NestedDate,
  NestedEmail,
  NestedEnum,
  NestedNumber,
  NestedObject,
  NestedString,
  NestedUUID,
} from "src/decorators/dto";
import {
  CategoryEnum,
  DepartmentEnum,
  EventTypeEnum,
  GenderEnum,
  JobStatusTypeEnum,
  SeasonTypeEnum,
  TpcMemberRoleEnum,
  JobCoordinatorRoleEnum,
} from "src/enums";

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

export class GetTpcMembersDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;

  @NestedEnum(TpcMemberRoleEnum, {})
  role: TpcMemberRoleEnum;

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

class SalariesDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  totalCTC: number;

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedUUID({ optional: true, isArray: true })
  programs?: string[];

  @NestedEnum(GenderEnum, { optional: true, isArray: true })
  genders?: GenderEnum[];

  @NestedEnum(CategoryEnum, { optional: true, isArray: true })
  categories?: CategoryEnum[];

  @NestedNumber({})
  minCPI: number;

  @NestedNumber({})
  tenthMarks: number;

  @NestedNumber({})
  twelthMarks: number;
}

class EventsDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  roundNumber: number;

  @NestedEnum(EventTypeEnum, {})
  type: EventTypeEnum;

  @NestedDate({})
  startDateTime: Date;

  @NestedDate({})
  endDateTime: Date;

  @NestedBoolean({})
  visibleToRecruiter: boolean;
}

class JobDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: string;

  @NestedEnum(JobStatusTypeEnum, {})
  currentStatus: JobStatusTypeEnum;

  @NestedBoolean({})
  active: boolean;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;

  @NestedObject({ type: SalariesDto, isArray: true })
  salaries: SalariesDto[];

  @NestedObject({ type: EventsDto, isArray: true })
  events: EventsDto[];
}

class JobCoordinatorsDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(JobCoordinatorRoleEnum, {})
  role: JobCoordinatorRoleEnum;

  @NestedObject({ type: JobDto })
  job: JobDto;
}

export class GetTpcMemberDto extends GetTpcMembersDto {
  @NestedObject({ type: JobCoordinatorsDto, isArray: true })
  jobCoordinators: JobCoordinatorsDto[];
}
