import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { UUID } from "sequelize";

export class JobCoordinatorIdParamDto {
  @ApiProperty({
    type: UUID,
  })
  @IsUUID()
  jobCoordinatorId: string;
}

export class createJobCoordinatorDto {
  @ApiProperty({
    type: UUID,
  })
  tpcMemberId: string;

  @ApiProperty({
    type: String,
  })
  role: string;
}

export class updateJobCoordinatorDto {
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
