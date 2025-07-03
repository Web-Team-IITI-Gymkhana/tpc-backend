import {
  NestedDate,
  NestedEmail,
  NestedEnum,
  NestedNumber,
  NestedObject,
  NestedString,
  NestedUUID,
} from "src/decorators/dto";
import { CourseEnum, DepartmentEnum, EventTypeEnum, GenderEnum, OfferStatusEnum, SeasonTypeEnum } from "src/enums";

export class ClashCompanyDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;
}

export class ClashSeasonDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;
}

export class ClashJobDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: string;

  @NestedObject({ type: ClashCompanyDto })
  company: ClashCompanyDto;

  @NestedObject({ type: ClashSeasonDto })
  season: ClashSeasonDto;
}

export class ClashEventDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  roundNumber: number;

  @NestedEnum(EventTypeEnum, {})
  type: EventTypeEnum;
}

export class ClashProgramDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(CourseEnum, {})
  course: CourseEnum;

  @NestedString({})
  branch: string;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;

  @NestedString({})
  year: string;
}

export class ClashUserDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;

  @NestedString({})
  email: string;

  @NestedString({})
  contact: string;
}

class ClashEventsDto {
  @NestedUUID({})
  aid: string;

  @NestedUUID({})
  caid: string;

  @NestedUUID({})
  eventId: string;

  @NestedUUID({})
  ceventId: string;

  @NestedDate({})
  startDateTime: Date;

  @NestedDate({})
  cstartDateTime: Date;

  @NestedDate({})
  endDateTime: Date;

  @NestedDate({})
  cendDateTime: Date;

  @NestedNumber({})
  roundNumber: number;

  @NestedNumber({})
  croundNumber: number;

  @NestedEnum(EventTypeEnum, {})
  type: EventTypeEnum;

  @NestedEnum(EventTypeEnum, {})
  ctype: EventTypeEnum;

  @NestedUUID({})
  studentId: string;

  @NestedUUID({})
  jobId: string;

  @NestedString({})
  rollNo: string;

  @NestedEnum(GenderEnum, {})
  gender: GenderEnum;

  @NestedNumber({})
  cpi: number;

  @NestedString({})
  name: string;

  @NestedEmail({})
  email: string;

  @NestedString({})
  contact: string;

  @NestedEnum(CourseEnum, {})
  course: CourseEnum;

  @NestedString({})
  branch: string;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;

  @NestedString({})
  year: string;

  @NestedString({})
  role: string;

  @NestedString({})
  companyName: string;
}

export class ClashOffCampusDto {
  @NestedUUID({})
  aid: string;

  @NestedUUID({})
  eventId: string;

  @NestedDate({})
  startDateTime: Date;

  @NestedDate({})
  endDateTime: Date;

  @NestedNumber({})
  roundNumber: number;

  @NestedEnum(EventTypeEnum, {})
  type: EventTypeEnum;

  @NestedUUID({})
  studentId: string;

  @NestedString({})
  rollNo: string;

  @NestedEnum(GenderEnum, {})
  gender: GenderEnum;

  @NestedNumber({})
  cpi: number;

  @NestedString({})
  name: string;

  @NestedEmail({})
  email: string;

  @NestedString({})
  contact: string;

  @NestedEnum(CourseEnum, {})
  course: CourseEnum;

  @NestedString({})
  branch: string;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;

  @NestedString({})
  year: string;

  @NestedString({})
  role: string;

  @NestedString({})
  companyName: string;

  @NestedNumber({})
  salary: number;

  @NestedEnum(OfferStatusEnum, {})
  status: OfferStatusEnum;
}

export class ClashOnCampusDto {
  @NestedUUID({})
  aid: string;

  @NestedUUID({})
  eventId: string;

  @NestedDate({})
  startDateTime: Date;

  @NestedDate({})
  endDateTime: Date;

  @NestedNumber({})
  roundNumber: number;

  @NestedEnum(EventTypeEnum, {})
  type: EventTypeEnum;

  @NestedUUID({})
  studentId: string;

  @NestedString({ optional: true })
  rollNo: string;

  @NestedEnum(GenderEnum, {})
  gender: GenderEnum;

  @NestedNumber({})
  cpi: number;

  @NestedString({})
  name: string;

  @NestedEmail({})
  email: string;

  @NestedString({})
  contact: string;

  @NestedEnum(CourseEnum, {})
  course: CourseEnum;

  @NestedString({})
  branch: string;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;

  @NestedString({})
  year: string;

  @NestedString({})
  role: string;

  @NestedString({})
  companyName: string;

  @NestedEnum(OfferStatusEnum, {})
  status: OfferStatusEnum;

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
}

export class ClashDto {
  @NestedObject({ type: ClashOnCampusDto, isArray: true })
  onCampus: ClashOnCampusDto[];

  @NestedObject({ type: ClashEventsDto, isArray: true })
  event: ClashEventsDto[];

  @NestedObject({ type: ClashOffCampusDto, isArray: true })
  offCampus: ClashOffCampusDto[];
}
