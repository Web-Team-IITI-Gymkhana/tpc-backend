import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsString, IsUUID, ValidateNested } from "class-validator";
import { TpcMemberRole } from "src/enums";
import { JobCoordinatorRole } from "src/enums/jobCoordinatorRole";
import { GetJobsReturnDto } from "src/job/dtos/jobGetReturn.dto";
import { GetUsersReturnDto } from "src/student/dtos/studentGetReturn.dto";

export class GetTpcMembersReturnDto {
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
  @IsString()
  department: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  role: string;

  @ApiProperty({
    type: GetUsersReturnDto,
  })
  @ValidateNested()
  @Type(() => GetUsersReturnDto)
  user: GetUsersReturnDto;
}

export class GetJobCoordinatorsReturnDto {
  @ApiProperty({
    enum: JobCoordinatorRole,
    example: "PRIMARY/SECONDARY",
  })
  @IsEnum(JobCoordinatorRole)
  role: JobCoordinatorRole;

  @ApiProperty({
    type: GetJobsReturnDto,
  })
  @ValidateNested()
  @Type(() => GetJobsReturnDto)
  job: GetJobsReturnDto;
}

export class GetTpcMemberReturnDto {
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
  @IsString()
  department: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  role: string;

  @ApiProperty({
    type: GetUsersReturnDto,
  })
  @ValidateNested()
  @Type(() => GetUsersReturnDto)
  user: GetUsersReturnDto;

  @ApiProperty({
    type: GetJobCoordinatorsReturnDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => GetJobCoordinatorsReturnDto)
  jobCoordinators: GetJobCoordinatorsReturnDto[];
}
