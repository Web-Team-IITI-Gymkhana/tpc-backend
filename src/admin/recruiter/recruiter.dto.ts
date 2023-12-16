import { IsNotEmpty, IsString, IsOptional, IsEnum, isNotEmpty, IsNumber, IsEmail } from "class-validator";

export class recruiterDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsString()
  public contact: string;

  @IsString()
  @IsNotEmpty()
  public companyName: string;
}
