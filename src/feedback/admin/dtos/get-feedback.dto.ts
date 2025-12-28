import {
  NestedNumber,
  NestedString,
  NestedUUID,
} from "src/decorators/dto";

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
