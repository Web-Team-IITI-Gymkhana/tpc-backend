import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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
