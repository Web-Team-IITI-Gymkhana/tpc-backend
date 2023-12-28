import { ApiProperty } from "@nestjs/swagger";

export class AddRecruiterDto {
  @ApiProperty({
    type: String,
  })
  userId: string;
  @ApiProperty({
    type: String,
  })
  companyId: string;
}
