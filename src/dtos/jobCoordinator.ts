import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsUUID, ValidateNested } from "class-validator";
import { UUID } from "sequelize";

export class JobCoordinatorIdParamDto {
  @ApiProperty({
    type: UUID,
  })
  @IsUUID()
  jobCoordinatorId: string;
}

export class CreateJobCoordinatorDto {
  @ApiProperty({
    type: UUID,
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
    type: UUID,
  })
  tpcMemberId?: string;

  @ApiProperty({
    type: String,
  })
  role?: string;

  @ApiProperty({
    type: UUID,
  })
  jobId?: string;
}
