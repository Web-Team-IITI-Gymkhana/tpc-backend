import { NestedNumber, NestedString, NestedUUID } from "src/decorators/dto";

export class GetFeedbackCompanyDto {
  @NestedUUID({})
  companyId: string;

  @NestedString({})
  companyName: string;

  @NestedNumber({})
  feedbackCount: number;
}
