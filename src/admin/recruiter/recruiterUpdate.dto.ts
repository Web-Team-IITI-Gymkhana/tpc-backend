import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class recruiterUpdateDto {
  @IsString()
  @IsNotEmpty()
  public memberId: string;

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
