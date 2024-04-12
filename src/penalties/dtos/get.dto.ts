import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString, IsUUID, ValidateNested } from "class-validator";
import { GetUsersReturnDto } from "src/student/dtos/studentGetReturn.dto";

class GetStudentReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: GetUsersReturnDto })
  @ValidateNested()
  @Type(() => GetUsersReturnDto)
  user: GetUsersReturnDto;
}

export class GetPenaltiesReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  penalty: number;

  @ApiProperty({ type: String })
  @IsString()
  reason: string;

  @ApiProperty({ type: GetStudentReturnDto })
  @ValidateNested()
  @Type(() => GetStudentReturnDto)
  student: GetStudentReturnDto;
}
