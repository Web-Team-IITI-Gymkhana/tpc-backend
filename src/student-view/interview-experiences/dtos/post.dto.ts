import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateIEDto {
  @ApiProperty({ type: String })
  @IsString()
  year: string;

  @ApiProperty({ type: String })
  @IsUUID()
  companyId: string;

  @ApiProperty({ type: String, format: "binary" })
  @IsOptional()
  @IsString()
  ie: string;
}
