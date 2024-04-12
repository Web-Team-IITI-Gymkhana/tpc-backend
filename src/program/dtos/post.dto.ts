import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsUUID } from "class-validator";
import { DepartmentEnum } from "src/enums/department.enum";

export class CreateProgramsDto {
  @ApiProperty({ type: String })
  @IsString()
  branch: string;

  @ApiProperty({ type: String })
  @IsString()
  course: string;

  @ApiProperty({ type: String })
  @IsString()
  year: string;

  @ApiProperty({ enum: DepartmentEnum })
  @IsEnum(DepartmentEnum)
  department: DepartmentEnum;
}
