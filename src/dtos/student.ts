import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsEnum, IsNumber, IsObject, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateNested } from "class-validator";
import { Category, Gender } from "src/db/enums";

export class CreateStudentDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  rollNo: string;

  @ApiProperty({
    type: String
  })
  @IsUUID()
  programId: string;

  @ApiProperty({
    type: 'enum',
    enum: Category
  })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({
    type: Number
  })
  @IsNumber()
  cpi: number;

  @ApiProperty({
    type: 'enum',
    enum: Gender
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    type: String
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String
  })
  @IsPhoneNumber()
  contact: string;
}

export class whereOptionsDto {
  @ApiPropertyOptional({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  from?: number;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  to?: number;

  @ApiPropertyOptional({
    type: Object,
  })
  @IsObject()
  @IsOptional()
  orderBy?: object;

  // @ApiPropertyOptional({
  //   type: Object,
  // })
  // @ValidateNested({each: true})
  // @Type(()=> FilterOptionsDto)
  // filterBy?: FilterOptionsDto
}