import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class UpdateJobDto {
  @ApiProperty({
    type: String,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  role?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  currentStatus?: string;

  @ApiProperty({
    type: String,
  })
  @IsUUID()
  companyId: string;

  @ApiProperty({
    type: String,
  })
  @IsUUID()
  seasonId: string;
}
