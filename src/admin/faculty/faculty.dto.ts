import { IsNotEmpty, IsString, IsOptional, IsEnum, isNotEmpty, IsNumber, IsEmail } from "class-validator";
import { Gender } from "src/db/enums/gender.enum";

export class facultyDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  public resume: string;

  @IsString()
  @IsNotEmpty()
  public department: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsString()
  public contact: string;
}
