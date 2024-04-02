import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CategoryEnum, GenderEnum, RoleEnum } from "src/enums";
import { DepartmentEnum } from "src/enums/department.enum";

export class GetUsersReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  contact: string;

  @ApiProperty({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  role: RoleEnum;
}

export class GetProgramsReturnDto {
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

export class GetResumesReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  filepath?: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  verified: boolean;
}

export class GetStudentsReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  //To remove
  @ApiProperty({ type: String })
  @IsUUID()
  userId: string;

  //To remove
  @ApiProperty({ type: String })
  @IsUUID()
  programId: string;

  @ApiProperty({ type: String })
  @IsString()
  rollNo: string;

  @ApiProperty({ enum: CategoryEnum })
  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  @ApiProperty({ enum: GenderEnum })
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({ type: Number })
  @IsNumber()
  cpi: number;

  @ApiProperty({ type: GetUsersReturnDto })
  @ValidateNested()
  @Type(() => GetUsersReturnDto)
  user: GetUsersReturnDto;

  @ApiProperty({ type: GetProgramsReturnDto })
  @ValidateNested()
  @Type(() => GetProgramsReturnDto)
  program: GetProgramsReturnDto;
}

export class GetStudentReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  //To remove
  @ApiProperty({ type: String })
  @IsUUID()
  userId: string;

  //To remove
  @ApiProperty({ type: String })
  @IsUUID()
  programId: string;

  @ApiProperty({ type: String })
  @IsString()
  rollNo: string;

  @ApiProperty({ enum: CategoryEnum })
  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  @ApiProperty({ enum: GenderEnum })
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({ type: Number })
  @IsNumber()
  cpi: number;

  @ApiProperty({ type: GetUsersReturnDto })
  @ValidateNested()
  @Type(() => GetUsersReturnDto)
  user: GetUsersReturnDto;

  @ApiProperty({ type: GetProgramsReturnDto })
  @ValidateNested()
  @Type(() => GetProgramsReturnDto)
  program: GetProgramsReturnDto;

  @ApiProperty({ type: GetResumesReturnDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => GetResumesReturnDto)
  resumes: GetResumesReturnDto[];

  @ApiProperty({ type: Number })
  @IsNumber()
  totalPenalty: number;
}
