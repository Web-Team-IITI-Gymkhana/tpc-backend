import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { GetProgramsDto } from "src/program/dtos/get.dto";
import { GetUsersReturnDto } from "src/student/dtos/studentGetReturn.dto";

class StudentReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  rollNo: string;

  @ApiProperty({ type: GetUsersReturnDto })
  @ValidateNested()
  @Type(() => GetUsersReturnDto)
  user: GetUsersReturnDto;

  @ApiProperty({ type: GetProgramsDto })
  @ValidateNested()
  @Type(() => GetProgramsDto)
  program: GetProgramsDto;
}

export class GetResumesReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  filepath: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  verified: boolean;

  @ApiProperty({ type: StudentReturnDto })
  @ValidateNested()
  @Type(() => StudentReturnDto)
  student: StudentReturnDto;
}
