import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, ValidateNested } from "class-validator";
import { UUID } from "sequelize";

export class AddFacultyDto {

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
  }


  export class GetFacultyDto {
    @ApiPropertyOptional()
    id?: string;
    @ApiPropertyOptional()
    department?: string;
    
  }
  
  export class FacultyIdParamDto {
    @ApiProperty({
      type: UUID,
    })
    facultyId: string;
  }