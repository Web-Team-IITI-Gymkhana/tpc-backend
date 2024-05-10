import { ApiProperty } from "@nestjs/swagger";

export class CreateStudentResumeDto {
  @ApiProperty({ type: "string", format: "binary" })
  resume: string;
}
