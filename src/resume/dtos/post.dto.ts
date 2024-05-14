import { ApiProperty } from "@nestjs/swagger";
import { NestedBoolean, NestedUUID } from "src/decorators/dto";

export class CreateResumeDto {
  @NestedBoolean({})
  verified: boolean;

  @NestedUUID({})
  studentId: string;

  filepath?: string;

  @ApiProperty({ type: String, format: "binary" })
  resume?: string;
}
