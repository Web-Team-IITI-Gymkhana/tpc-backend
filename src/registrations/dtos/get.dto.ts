import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsString, IsUUID, ValidateNested, IsEmail } from "class-validator";
import { SeasonReturnDto } from "src/season/dtos/get.dto";

class UserReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email: string;
}

class StudentReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  rollNo: string;

  @ApiProperty({ type: UserReturnDto })
  @ValidateNested()
  @Type(() => UserReturnDto)
  user: UserReturnDto;
}

export class RegistrationReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  registered: boolean;

  @ApiProperty({ type: SeasonReturnDto })
  @ValidateNested()
  @Type(() => SeasonReturnDto)
  season: SeasonReturnDto;

  @ApiProperty({ type: StudentReturnDto })
  @ValidateNested()
  @Type(() => StudentReturnDto)
  student: StudentReturnDto;
}
