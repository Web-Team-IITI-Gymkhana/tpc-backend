import { IsNotEmpty, IsString, IsEmail, IsEnum } from 'class-validator';
import { Roles } from './role.enum';

export class teamDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsEnum(Roles)
  public role: Roles;
}
