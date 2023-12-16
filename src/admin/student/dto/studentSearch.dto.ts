import { IsNotEmpty, IsString, IsOptional, IsEnum, isNotEmpty, IsNumber, IsEmail } from "class-validator";
import { Gender } from "src/db/enums/gender.enum";

export class studentSearchDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  public category: string;

  @IsString()
  @IsOptional()
  public rollNo: string;

  @IsEnum(Gender)
  @IsOptional()
  public gender: Gender;

  @IsString()
  @IsOptional()
  public branch: string;

  @IsString()
  @IsOptional()
  public graduationYear: Date;

  @IsNumber()
  @IsOptional()
  public currentCPI: Number;

  @IsString()
  @IsOptional()
  public resume: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  public email: string;

  @IsNumber()
  @IsOptional()
  public totalPenalty: Number;

  @IsString()
  @IsOptional()
  public contact: string;
}
