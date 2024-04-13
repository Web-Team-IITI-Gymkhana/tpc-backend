import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsUUID, IsEnum, IsOptional, IsString, IsDate, IsBoolean, ValidateNested } from "class-validator";
import { EventTypeEnum } from "src/enums";
import { JobFacultyReturnDto } from "src/faculty/dtos/get.dto";
import { GetProgramsDto } from "src/program/dtos/get.dto";
import { ResumeReturnDto } from "src/student-view/students/dtos/get.dto";
import { GetUsersReturnDto } from "src/student/dtos/studentGetReturn.dto";

export class GetEventsReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  roundNumber: number;

  @ApiProperty({ enum: EventTypeEnum })
  @IsEnum(EventTypeEnum)
  type: EventTypeEnum;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  metadata?: string;

  @ApiProperty({ type: String })
  @IsDate()
  startDateTime: Date;

  @ApiProperty({ type: String })
  @IsDate()
  endDateTime: Date;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  visibleToRecruiter: boolean;

  @ApiProperty({ type: JobFacultyReturnDto })
  @ValidateNested()
  @Type(() => JobFacultyReturnDto)
  job: JobFacultyReturnDto;
}

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

class ApplicationReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: ResumeReturnDto })
  @ValidateNested()
  @Type(() => ResumeReturnDto)
  resume: ResumeReturnDto;

  @ApiProperty({ type: StudentReturnDto })
  @ValidateNested()
  @Type(() => StudentReturnDto)
  student: StudentReturnDto;
}

export class GetEventReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  roundNumber: number;

  @ApiProperty({ enum: EventTypeEnum })
  @IsEnum(EventTypeEnum)
  type: EventTypeEnum;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  metadata?: string;

  @ApiProperty({ type: String })
  @IsDate()
  startDateTime: Date;

  @ApiProperty({ type: String })
  @IsDate()
  endDateTime: Date;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  visibleToRecruiter: boolean;

  @ApiProperty({ type: JobFacultyReturnDto })
  @ValidateNested()
  @Type(() => JobFacultyReturnDto)
  job: JobFacultyReturnDto;

  @ApiProperty({ type: ApplicationReturnDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => ApplicationReturnDto)
  applications: ApplicationReturnDto[];
}
