import { ApiProperty } from "@nestjs/swagger";
import { NestedString } from "src/decorators/dto";

export class CreateStudentResumeDto {
  @ApiProperty({ type: "string", format: "binary" })
  resume: string;

  @NestedString({})
  name: string;
}
