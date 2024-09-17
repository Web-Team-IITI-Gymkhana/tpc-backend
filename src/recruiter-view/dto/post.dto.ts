import { NestedString, NestedUUID } from "src/decorators/dto";

export class PostFeedbackdto {
  @NestedUUID({})
  studentId: string;

  @NestedUUID({})
  jobId: string;

  @NestedString({})
  remarks: string;
}
