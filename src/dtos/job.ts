import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { EventType, JobStatusType } from "src/db/enums";

export class JobIdParamDto {
  @ApiProperty()
  jobId: string;
}
export class AddJobDto {
  @ApiProperty()
  seasonId: string;
  @ApiProperty()
  recruiterId: string;
  @ApiProperty()
  companyId: string;
  @ApiProperty()
  role: string;
  @ApiPropertyOptional()
  active?: boolean;
  @ApiPropertyOptional()
  metadata?: object;
}

export class UpdateJobDto {
  @ApiPropertyOptional()
  status?: JobStatusType;
  @ApiPropertyOptional()
  active: boolean;
  @ApiPropertyOptional()
  metadata?: object;
}

export class GetJobQuery {
  @ApiPropertyOptional()
  seasonId?: string;
  @ApiPropertyOptional()
  recruiterId?: string;
  @ApiPropertyOptional()
  companyId?: string;
  @ApiPropertyOptional()
  role?: string;
  @ApiPropertyOptional()
  active?: boolean;
  @ApiPropertyOptional()
  metadata?: object;
}

export class EventIdParamDto {
  @ApiProperty()
  eventId: string;
}

export class AddJobEventDto {
  @ApiProperty()
  type: EventType;
  @ApiPropertyOptional()
  metadata?: object;
  @ApiProperty()
  roundNumber: Number;
  @ApiPropertyOptional()
  startDateTime?: Date;
  @ApiPropertyOptional()
  endDateTime?: Date;
}

export class UpdateJobEventDto {
  @ApiPropertyOptional()
  metadata?: object;
  @ApiPropertyOptional()
  startDateTime?: Date;
  @ApiPropertyOptional()
  endDateTime?: Date;
}


export class CreateJobFacultyApprovalRequestDto {
  @ApiProperty()
  facultyId: string;
  @ApiProperty()
  remarks: string;

}
export class CreateJobFacultyApprovalRequestsDto {
  @ApiProperty({
    isArray: true,
    type: CreateJobFacultyApprovalRequestDto,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateJobFacultyApprovalRequestDto)
  facultyApprovalRequests: CreateJobFacultyApprovalRequestDto[];
}

export class FacultyApprovalRequestIdParamDto {
  @ApiProperty()
  facultyApprovalRequestId: string;
}


export class UpdateJobFacultyApprovalRequestDto {
  @ApiPropertyOptional()
  facultyId: string;
  @ApiPropertyOptional()
  remarks: string;
  @ApiPropertyOptional()
  approved: boolean;

}

export class GetJobFacultyApprovalRequestQuery {
  @ApiPropertyOptional()
  id?: string;
  @ApiPropertyOptional()
  jobId?: string;
  @ApiPropertyOptional()
  facultyId?: string;

}

