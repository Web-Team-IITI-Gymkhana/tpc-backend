import { ApiProperty } from "@nestjs/swagger";
import { NestedUUID } from "src/decorators/dto";

export class CreateIEDto {
  studentId?: string;

  @NestedUUID({})
  companyId: string;

  @NestedUUID({})
  seasonId: string;

  studentName?: string;

  filename?: string;

  @ApiProperty({ type: String, format: "binary" })
  ie: string;
}
