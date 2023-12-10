import { IsNotEmpty, IsString, IsOptional, IsEnum, isNotEmpty, IsNumber, IsEmail } from "class-validator";
import { Gender } from "src/db/enums/gender.enum";

export class studentSearchDto {
  @IsString()
  public name: string;

  @IsString()
  public category: string;

  @IsString()
  public rollNo: string;

  @IsEnum(Gender)
  public gender: Gender;

  @IsString()
  public branch: string;

  @IsString()
  public graduationYear: Date;

  @IsNumber()
  public currentCPI: Number;

  @IsString()
  public resume: string;

  @IsString()
  @IsEmail()
  public email: string;

  @IsNumber()
  public totalPenalty: Number;

  @IsString()
  public contact: string;
}
