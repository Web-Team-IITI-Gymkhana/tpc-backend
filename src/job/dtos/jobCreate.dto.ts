import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsEnum } from "class-validator";
import { JobCoordinatorRoleEnum } from "src/enums/jobCoordinatorRole";

export class CreateJobCoordinatorsDto {
  @ApiProperty({ type: String })
  @IsUUID()
  tpcMemberId: string;

  @ApiProperty({ enum: JobCoordinatorRoleEnum })
  @IsEnum(JobCoordinatorRoleEnum)
  role: JobCoordinatorRoleEnum;
}
