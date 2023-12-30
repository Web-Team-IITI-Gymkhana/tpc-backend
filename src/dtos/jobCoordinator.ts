import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {  ValidateNested } from "class-validator";

export class JobCoordinatorIdParamDto {
  @ApiProperty({
    type: String,
  })
  jobCoordinatorId: string;
}

export class CreateJobCoordinatorDto {
  @ApiProperty({
    type: String,
  })
  tpcMemberId: string;

  @ApiProperty({
    type: String,
  })
  role: string;
}

export class CreateJobCoordinatorsDto {
  @ApiProperty({
    isArray: true,
    type: CreateJobCoordinatorDto,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateJobCoordinatorDto)
  jobCoordinators: CreateJobCoordinatorDto[];
}

export class UpdateJobCoordinatorDto {
  @ApiProperty({
    type: String,
  })
  tpcMemberId?: string;

  @ApiProperty({
    type: String,
  })
  role?: string;

  @ApiProperty({
    type: String,
  })
  jobId?: string;
}
