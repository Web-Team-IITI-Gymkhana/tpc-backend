import {
  NestedEnum,
  NestedNumber,
  NestedString,
  NestedUUID,
} from "src/decorators/dto";
import { SeasonTypeEnum } from "src/enums";


export class GetFeedbackSeasonDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;
}

export class GetFeedbackCompanyDto {
  @NestedUUID({})
  companyId: string;

  @NestedString({})
  companyName: string;

  @NestedNumber({})
  feedbackCount: number;
}

export class RecruiterFeedbackItemDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  officialName: string;

  @NestedString({})
  officialEmail: string;

  @NestedString({})
  designation: string;

  @NestedNumber({})
  communicationPromptness: number;

  @NestedNumber({})
  queryHandling: number;

  @NestedString({ optional: true })
  recommendations?: string;
}
