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
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional } from "class-validator";

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

  @ApiPropertyOptional({
    description: "Additional data fields required for this event as key-value pairs",
    example: { "preferredLocation": "Enter your preferred work location", "skillLevel": "Rate your skill level (1-10)" }
  })
  @IsOptional()
  @IsObject()
  additionalData?: Record<string, string>;

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

  @ApiPropertyOptional({
    description: "Additional data provided by student for this application",
    example: { "preferredLocation": "San Francisco", "skillLevel": "8" }
  })
  @IsOptional()
  @IsObject()
  additionalData?: Record<string, string>;
}

export class GetEventDto extends GetEventsDto {
  @NestedObject({ type: ApplicationsDto, isArray: true })
  applications: ApplicationsDto[];
}
