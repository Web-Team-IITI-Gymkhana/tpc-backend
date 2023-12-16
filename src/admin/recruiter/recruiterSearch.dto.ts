import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class recruiterSearchDto {
  @IsString()
  public name: string;

  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  public contact: string;

  @IsString()
  public companyName: string;
}
