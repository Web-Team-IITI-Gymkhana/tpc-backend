import {
  NestedNumber,
  NestedString,
  NestedUUID,
} from "src/decorators/dto";

export class CreateRecruiterFeedbackDto {
  /* ----------- Context ----------- */

  @NestedUUID({})
  seasonId: string;

  /* ----------- Ratings ----------- */

  @NestedNumber({})
  communicationPromptness: number;

  @NestedNumber({})
  queryHandling: number;

  @NestedNumber({})
  logisticsArrangement: number;

  @NestedNumber({})
  studentFamiliarity: number;

  @NestedNumber({})
  studentCommunication: number;

  @NestedNumber({})
  resumeQuality: number;

  @NestedNumber({})
  studentPreparedness: number;

  @NestedNumber({})
  disciplineAndPunctuality: number;

  /* ----------- Text ----------- */

  @NestedString({})
  rightTimeToContact: string;

  @NestedString({ optional: true })
  recommendations?: string;
}
