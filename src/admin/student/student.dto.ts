import { IsNotEmpty, IsString, IsOptional, IsEnum, isNotEmpty, IsNumber, IsEmail } from "class-validator";
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
  public resume: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNumber()
  public totalPenalty: Number;

  @IsString()
  public contact: string;
}
