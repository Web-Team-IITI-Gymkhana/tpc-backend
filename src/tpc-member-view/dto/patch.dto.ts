import {
  NestedBoolean,
  NestedDate,
  NestedEnum,
  NestedNumber,
  NestedObject,
  NestedString,
  NestedUUID,
} from "src/decorators/dto";
import { JobStatusTypeEnum } from "src/enums";
import { SelectionProcedureDto } from "src/job/dtos/jaf.dto";

export class UpdateJobsDto {
  @NestedUUID({ optional: true })
  seasonId?: string;

  @NestedUUID({ optional: true })
  recruiterId?: string;

  @NestedUUID({ optional: true })
  companyId?: string;

  @NestedString({ optional: true })
  role?: string;

  @NestedBoolean({ optional: true })
  active?: boolean;

  @NestedEnum(JobStatusTypeEnum, { optional: true })
  currentStatus?: JobStatusTypeEnum;

  @NestedNumber({ optional: true })
  noOfVacancies?: number;

  @NestedString({ optional: true })
  duration?: string;

  @NestedString({ optional: true })
  location?: string;

  @NestedObject({ type: SelectionProcedureDto, optional: true })
  selectionProcedure?: SelectionProcedureDto;

  @NestedString({ optional: true })
  description?: string;

  @NestedString({ optional: true, isArray: true })
  attachments?: string[];

  @NestedString({ optional: true, isArray: true })
  skills?: string[];

  @NestedDate({ optional: true })
  offerLetterReleaseDate?: Date;

  @NestedDate({ optional: true })
  joiningDate?: Date;

  @NestedString({ optional: true })
  feedback?: string;
}
