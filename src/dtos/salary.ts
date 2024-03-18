import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class SalaryIdParamDto {
  @ApiProperty({
    type: String,
  })
  salaryId: string;
}

export class CreateSalaryDto {
  @ApiProperty({
    type: String,
  })
  salary: number;

  @ApiProperty({
    type: String,
  })
  salaryPeriod: number;

  @ApiPropertyOptional({
    type: JSON,
  })
  metadata?: Object;

  @ApiProperty({
    type: JSON,
  })
  constraints: Object;
}

export class CreateSalariesDto {
  @ApiProperty({
    isArray: true,
    type: CreateSalaryDto,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateSalaryDto)
  salaries: CreateSalaryDto[];
}

export class UpdateSalaryDto {
  @ApiPropertyOptional({
    type: String,
  })
  salary?: number;

  @ApiPropertyOptional({
    type: String,
  })
  salaryPeriod?: number;

  @ApiPropertyOptional({
    type: JSON,
  })
  metadata?: Object;

  @ApiPropertyOptional({
    type: JSON,
  })
  constraints?: Object;

  @ApiPropertyOptional({
    type: String,
  })
  jobId?: string;
}
