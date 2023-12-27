import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, ValidateNested } from "class-validator";
import { Category, Gender, Role } from "src/db/enums";

export class CreateStudentDto {
  @ApiProperty({
    type: String,
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    type: String,
  })
  name: string;
  @ApiPropertyOptional()
  contact: string;
  @ApiProperty()
  rollNo: string;
  @ApiProperty()
  category: Category;
  @ApiProperty()
  gender: Gender;
  @ApiProperty()
  programId: string;
}

export class AddStudentsDto {
  @ApiProperty({
    isArray: true,
    type: CreateStudentDto,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateStudentDto)
  students: CreateStudentDto[];
}

export class GetStudentQueryDto {
  @ApiPropertyOptional()
  id?: string;
  @ApiPropertyOptional()
  userId?: string;
  @ApiPropertyOptional()
  rollNo?: string;
  @ApiPropertyOptional({ enum: Category })
  category?: Category;
  @ApiPropertyOptional({ enum: Gender })
  gender?: Gender;
  @ApiPropertyOptional()
  programId?: string;
}
