import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsString, IsUUID, ValidateNested } from "class-validator";
import { CategoryEnum, GenderEnum } from "src/enums";
import { DepartmentEnum } from "src/enums/department.enum";

class ProgramReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  course: string;

  @ApiProperty({ type: String })
  @IsString()
  branch: string;

  @ApiProperty({ enum: DepartmentEnum })
  @IsEnum(DepartmentEnum)
  department: DepartmentEnum;

  @ApiProperty({ type: String })
  @IsString()
  year: string;
}

export class ResumeReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  filepath: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  verified: boolean;
}

class SeasonReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  year: string;

  @ApiProperty({ type: String })
  @IsString()
  type: string;
}

class RegistrationReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: SeasonReturnDto })
  @ValidateNested()
  @Type(() => SeasonReturnDto)
  season: SeasonReturnDto;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  registered: boolean;
}

class UserReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  contact: string;
}

class PenaltyReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  penalty: number;

  @ApiProperty({ type: String })
  @IsString()
  reason: string;
}

export class StudentReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  rollNo: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  cpi: number;

  @ApiProperty({ enum: CategoryEnum })
  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  @ApiProperty({ enum: GenderEnum })
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({ type: UserReturnDto })
  @ValidateNested()
  @Type(() => UserReturnDto)
  user: UserReturnDto;

  @ApiProperty({ type: ProgramReturnDto })
  @ValidateNested()
  @Type(() => ProgramReturnDto)
  program: ProgramReturnDto;

  @ApiProperty({ type: PenaltyReturnDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => PenaltyReturnDto)
  penalties: PenaltyReturnDto[];

  @ApiProperty({ type: RegistrationReturnDto })
  @ValidateNested()
  @Type(() => RegistrationReturnDto)
  registrations: RegistrationReturnDto[];
}
