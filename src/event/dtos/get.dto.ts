import { Type } from "class-transformer";
import {
  NestedNumber,
  NestedUUID,
  NestedEnum,
  NestedString,
  NestedDate,
  NestedBoolean,
  NestedObject,
} from "src/decorators/dto";
import { EventTypeEnum, SeasonTypeEnum } from "src/enums";
import { GetStudentsDto } from "src/student/dtos/get.dto";

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

export class GetEventsDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  roundNumber: number;

  @NestedEnum(EventTypeEnum, {})
  type: EventTypeEnum;

  @NestedString({ optional: true })
  metadata?: string;

  @NestedDate({})
  startDateTime: Date;

  @NestedDate({})
  endDateTime: Date;

  @NestedBoolean({})
  visibleToRecruiter: boolean;

  @NestedObject({ type: JobDto })
  job: JobDto;
}

class ResumeDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  filepath: string;

  @NestedString({ optional: true })
  name?: string;

  @NestedBoolean({})
  verified: boolean;
}

class ApplicationsDto {
  @NestedUUID({})
  id: string;

  @NestedObject({ type: GetStudentsDto })
  student: GetStudentsDto;

  @NestedObject({ type: ResumeDto })
  resume: ResumeDto;
}

export class GetEventDto extends GetEventsDto {
  @NestedObject({ type: ApplicationsDto, isArray: true })
  applications: ApplicationsDto[];
}
