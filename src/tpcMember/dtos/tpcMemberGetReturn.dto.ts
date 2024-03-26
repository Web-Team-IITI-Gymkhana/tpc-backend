import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsUUID, ValidateNested } from "class-validator";
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
    type: GetJobsReturnDto,
  })
  @ValidateNested({ each: true })
  @Type(() => GetJobsReturnDto)
  jobs: GetJobsReturnDto[];
}
