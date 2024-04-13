import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateFacultyApprovalsDto {
  @ApiProperty({ type: String })
  @IsUUID()
  facultyId: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  remarks?: string;
}
