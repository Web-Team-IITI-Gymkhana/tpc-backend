import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUrl, IsUUID, ValidateNested } from "class-validator";
import { Is } from "sequelize-typescript";
import { CompanyCategory } from "src/enums";
import IndustryDomain from "src/enums/industryDomains.enum";
import { AddressDto } from "src/job/dtos/jaf.dto";
import { GetUsersReturnDto } from "src/student/dtos/studentGetReturn.dto";

export class GetCompaniesReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;
}

export class GetCompanyReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({
    enum: IndustryDomain,
    isArray: true,
  })
  @IsEnum(IndustryDomain, { each: true })
  @IsArray()
  domains: IndustryDomain[];

  @ApiPropertyOptional({
    enum: CompanyCategory,
  })
  @IsOptional()
  @IsEnum(CompanyCategory)
  category: CompanyCategory;

  @ApiProperty({
    type: AddressDto,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  size?: number;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  yearOfEstablishment?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  annualTurnover?: string;

  @ApiProperty({
    type: String,
  })
  @IsUrl()
  socialMediaLink: string;
}

export class GetRecruitersReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsUUID()
  companyId: string;

  @ApiProperty({
    type: String,
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  designation: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  landline?: string;

  @ApiProperty({
    type: GetUsersReturnDto,
  })
  @ValidateNested()
  @Type(() => GetUsersReturnDto)
  user: GetUsersReturnDto;

  @ApiProperty({
    type: GetCompaniesReturnDto,
  })
  @ValidateNested()
  @Type(() => GetCompaniesReturnDto)
  company: GetCompaniesReturnDto;
}

export class GetRecruiterReturnDto {
  @ApiProperty({
    type: String,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsUUID()
  companyId: string;

  @ApiProperty({
    type: String,
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  designation: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  landline?: string;

  @ApiProperty({
    type: GetUsersReturnDto,
  })
  @ValidateNested()
  @Type(() => GetUsersReturnDto)
  user: GetUsersReturnDto;

  @ApiProperty({
    type: GetCompanyReturnDto,
  })
  @ValidateNested()
  @Type(() => GetCompanyReturnDto)
  company: GetCompanyReturnDto;
}
