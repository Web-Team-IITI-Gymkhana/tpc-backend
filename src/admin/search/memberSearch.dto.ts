import { IsString, IsEnum, IsEmail } from "class-validator";
import { Role } from "src/db/enums/role.enum";

export class memberSearchDto {
  @IsString()
  public name: string;

  @IsEnum(Role)
  public role: Role;

  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  public contact: string;
}
