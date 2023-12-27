import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CompanyIdParamDto {
  @ApiProperty()
  companyId: string;
}

export class CompanyMetadataDto {
  @ApiPropertyOptional({
    type: String,
  })
  description?: string;
  @ApiPropertyOptional({
    type: String,
  })
  logo?: string;
}

export class AddCompanyDto {
  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiPropertyOptional({
    type: CompanyMetadataDto,
  })
  metadata?: CompanyMetadataDto;
}

export class UpdateCompanyDto {
  @ApiPropertyOptional({
    type: CompanyMetadataDto,
  })
  metadata?: CompanyMetadataDto;
}
