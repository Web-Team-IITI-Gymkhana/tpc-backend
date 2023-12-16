import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsEmail, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Gender } from "src/db/enums/gender.enum";

export class studentDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public category: string;

  @IsString()
  @IsNotEmpty()
  public rollNo: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  public gender: Gender;

  @IsString()
  @IsNotEmpty()
  public branch: string;

  @IsString()
  @IsNotEmpty()
  public graduationYear: Date;

  @IsNumber()
  @IsNotEmpty()
  public currentCPI: Number;

  @IsString()
  @IsOptional()
  public resume: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNumber()
  @IsOptional()
  public totalPenalty: Number;

  @IsString()
  @IsOptional()
  public contact: string;
}
