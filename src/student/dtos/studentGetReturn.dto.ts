import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { Category, Gender } from "src/enums";

export class GetStudentUsersReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  contact: string;
}

export class GetStudentProgramsReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  course: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  branch: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  year: string;
}

export class GetStudentResumeReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: Object,
  })
  @IsObject()
  metadata: object;

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  verified: boolean;
}

export class GetStudentReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    type: String,
  })
  @IsUUID()
  programId: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  rollNo: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  category: string;

  @ApiProperty({
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  cpi: number;

  @ApiProperty({
    type: GetStudentUsersReturnDto,
  })
  @ValidateNested({ each: true })
  @Type(() => GetStudentUsersReturnDto)
  user: GetStudentUsersReturnDto;

  @ApiProperty({
    type: GetStudentProgramsReturnDto,
  })
  @ValidateNested({ each: true })
  @Type(() => GetStudentProgramsReturnDto)
  program: GetStudentProgramsReturnDto;

  @ApiPropertyOptional({
    type: GetStudentResumeReturnDto,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GetStudentResumeReturnDto)
  resumes: GetStudentResumeReturnDto[];

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  totalPenalty: number;
}

export class GetStudentsReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    type: String,
  })
  @IsUUID()
  programId: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  rollNo: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  category: string;

  @ApiProperty({
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  cpi: number;

  @ApiProperty({
    type: GetStudentUsersReturnDto,
  })
  @ValidateNested({ each: true })
  @Type(() => GetStudentUsersReturnDto)
  user: GetStudentUsersReturnDto;

  @ApiProperty({
    type: GetStudentProgramsReturnDto,
  })
  @ValidateNested({ each: true })
  @Type(() => GetStudentProgramsReturnDto)
  program: GetStudentProgramsReturnDto;
}
