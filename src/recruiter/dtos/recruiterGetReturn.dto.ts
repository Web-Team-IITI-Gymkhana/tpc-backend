import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, IsUrl, IsUUID, ValidateNested } from "class-validator";
import { CompanyCategoryEnum } from "src/enums";
import { IndustryDomainEnum } from "src/enums/industryDomains.enum";
import { AddressDto } from "src/job/dtos/jaf.dto";
import { GetUsersReturnDto } from "src/student/dtos/studentGetReturn.dto";

export class GetCompaniesReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;
}

export class GetCompanyReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ enum: IndustryDomainEnum, isArray: true })
  @IsEnum(IndustryDomainEnum, { each: true })
  domains: IndustryDomainEnum[];

  @ApiProperty({ enum: CompanyCategoryEnum })
  @IsEnum(CompanyCategoryEnum)
  category: CompanyCategoryEnum;

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  size?: number;

  @ApiProperty({ type: String })
  @IsString()
  yearOfEstablishment: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  annualTurnover?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUrl()
  socialMediaLink?: string;
}

export class GetRecruitersReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  //Remove this.
  @ApiProperty({ type: String })
  @IsUUID()
  userId: string;

  @ApiProperty({ type: GetUsersReturnDto })
  @ValidateNested()
  @Type(() => GetUsersReturnDto)
  user: GetUsersReturnDto;

  //Remove this.
  @ApiProperty({ type: String })
  @IsUUID()
  companyId: string;

  @ApiProperty({ type: GetCompaniesReturnDto })
  @ValidateNested()
  @Type(() => GetCompaniesReturnDto)
  company: GetCompaniesReturnDto;

  @ApiProperty({ type: String })
  @IsString()
  designation: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  landline?: string;
}

export class GetRecruiterReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  //Remove this.
  @ApiProperty({ type: String })
  @IsUUID()
  userId: string;

  @ApiProperty({ type: GetUsersReturnDto })
  @ValidateNested()
  @Type(() => GetUsersReturnDto)
  user: GetUsersReturnDto;

  //Remove this.
  @ApiProperty({ type: String })
  @IsUUID()
  companyId: string;

  @ApiProperty({ type: GetCompanyReturnDto })
  @ValidateNested()
  @Type(() => GetCompanyReturnDto)
  company: GetCompanyReturnDto;

  @ApiProperty({ type: String })
  @IsString()
  designation: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  landline?: string;
}
