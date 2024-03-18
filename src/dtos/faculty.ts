import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsOptional, ValidateNested } from "class-validator";

export class CreateFacultyDto {
  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
  })
  contact: string;

  @ApiProperty({
    type: String,
  })
  department: string;
}

export class UpdateFacultyDto {
  @ApiProperty({
    type: String,
  })
  department?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  contact?: string;

  @ApiProperty()
  role?: string;
}

export class GetFacultyDto {
  @ApiPropertyOptional()
  id?: string;
  @ApiPropertyOptional()
  department?: string;
  @ApiPropertyOptional()
  name?: string;
  @ApiPropertyOptional()
  email?: string;
  @ApiPropertyOptional()
  contact?: string;
  @ApiPropertyOptional()
  userId?: string;
}

export class FacultyIdParamDto {
  @ApiProperty({
    type: String,
  })
  facultyId: string;
}

export class CreateFacultiesDto {
  @ApiProperty({
    isArray: true,
    type: CreateFacultyDto,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateFacultyDto)
  faculties: CreateFacultyDto[];
}
