import { NestedUUID } from "src/decorators/dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional } from "class-validator";

export class ApplySalariesDto {
  @NestedUUID({})
  salaryId: string;

  @NestedUUID({})
  resumeId: string;

  @ApiPropertyOptional({
    description: "Additional data provided by student for the application",
    example: { "preferredLocation": "San Francisco", "skillLevel": "8" }
  })
  @IsOptional()
  @IsObject()
  additionalData?: Record<string, string>;
}
