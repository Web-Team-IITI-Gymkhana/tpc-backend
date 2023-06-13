import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class companiesDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  public imageLink?: string;
}
