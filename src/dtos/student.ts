import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsInt,
  IsEnum,
  IsObject,
  IsBoolean,
  IsEmail,
} from "class-validator";
import { Type } from "class-transformer";
import { OrderByEnum, MatchOptionsNumber, MatchOptionsString } from "src/constants";

export class FilterOptionsDto {
  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MatchOptionsString)
  id?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MatchOptionsString)
  userId?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MatchOptionsString)
  name?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MatchOptionsString)
  rollNo?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MatchOptionsString)
  course?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MatchOptionsString)
  branch?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MatchOptionsString)
  year?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MatchOptionsString)
  gender?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsNumber,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MatchOptionsNumber)
  cpi?: MatchOptionsNumber;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MatchOptionsString)
  category?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MatchOptionsString)
  email?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MatchOptionsString)
  contact?: MatchOptionsString;
}

export class OrderOptionsDto {
  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  userId?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  name?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  email?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  contact?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  rollNo?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  course?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  branch?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  year?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  gender?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  cpi?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  category?: OrderByEnum;
}

export class WhereOptionsDto {
  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  from?: number;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  to?: number;

  @ApiPropertyOptional({
    type: FilterOptionsDto,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FilterOptionsDto)
  filterBy?: FilterOptionsDto;

  @ApiPropertyOptional({
    type: OrderOptionsDto,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderOptionsDto)
  orderBy?: OrderOptionsDto;
}

export class GetStudentUsersReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
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

export class GetStudentsReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
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
    type: String,
  })
  @IsString()
  gender: string;

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
  @IsString()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
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
    type: String,
  })
  @IsString()
  gender: string;

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

export class CreateStudentDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  rollNo: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  programId: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  category: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  cpi: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  gender: string;

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

export class CreateStudentUserReturnDto {
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
}

export class CreateStudentReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: CreateStudentUserReturnDto,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateStudentUserReturnDto)
  user: CreateStudentUserReturnDto;
}

export class UpdateStudentDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  id: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  rollNo?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  programId?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  cpi?: number;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  contact?: string;
}

export class UpdateStudentReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
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
    type: String,
  })
  @IsString()
  gender: string;

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
}

export class DeleteStudentQueryDto {
  @ApiProperty({
    type: String || Array<string>,
  })
  @IsString({ each: true })
  userId: string | string[];
}
