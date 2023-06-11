import { IsNotEmpty, IsString, IsOptional, IsEmail, Length } from 'class-validator';

export class companiesContactDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsString()
  @IsOptional()
  @Length(10, 15, { message: 'Phone Number has to be between 10 to 15 characters ' })
  public primaryNumber?: string;

  @IsString()
  @IsOptional()
  @Length(10, 15, { message: 'Phone Number has to be between 10 to 15 characters ' })
  public secondaryNumber?: string;

  @IsString()
  public role: string;
}

// export class AuthDto {
//   @IsNotEmpty()
//   @IsString()
//   @IsEmail()
//   public email: string;

//   @IsNotEmpty()
//   @IsString()
//   @Length(3, 20, { message: 'Passowrd has to be at between 3 and 20 chars' })
//   public password: string;

//   @IsString()
//   @IsOptional()
//   public hashedRT: string;

//   @IsString()
//   @IsOptional()
//   public authType: string;

//   @IsBoolean()
//   @IsOptional()
//   public isVerified: boolean;
// }
