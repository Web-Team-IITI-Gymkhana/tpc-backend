import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class OffCampusOfferIdParamDto {
  @ApiProperty({
    type: String,
  })
  offCampusOfferId: string;
}

export class CreateOffCampusOfferDto {
  @ApiProperty({
    type: String,
  })
  salary: number;

  @ApiProperty({
    type: String,
  })
  salaryPeriod: number;

  @ApiPropertyOptional({
    type: JSON,
  })
  metadata?: Object;

  @ApiProperty({
    type: String,
  })
  studentId: string;

  @ApiProperty({
    type: String,
  })
  companyId: string;

  @ApiProperty({
    type: String,
  })
  seasonId: string;

  @ApiProperty({
    type: String,
  })
  offerType: string;

  @ApiProperty({
    type: String,
  })
  status: string;
}

export class CreateOffCampusOffersDto {
  @ApiProperty({
    isArray: true,
    type: CreateOffCampusOfferDto,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateOffCampusOfferDto)
  offCampusOffers: CreateOffCampusOfferDto[];
}

export class UpdateOffCampusOfferDto {
  @ApiPropertyOptional({
    type: String,
  })
  salary?: number;

  @ApiPropertyOptional({
    type: String,
  })
  salaryPeriod?: number;

  @ApiPropertyOptional({
    type: JSON,
  })
  metadata?: Object;

  @ApiPropertyOptional({
    type: String,
  })
  studentId?: string;

  @ApiPropertyOptional({
    type: String,
  })
  companyId?: string;

  @ApiPropertyOptional({
    type: String,
  })
  seasonId?: string;

  @ApiPropertyOptional({
    type: String,
  })
  offerType?: string;

  @ApiPropertyOptional({
    type: String,
  })
  status?: string;
}

export class OffCampusOfferQueryDto {
  @ApiPropertyOptional({
    type: String,
  })
  salary?: number;

  @ApiPropertyOptional({
    type: String,
  })
  salaryPeriod?: number;

  @ApiPropertyOptional({
    type: JSON,
  })
  metadata?: Object;

  @ApiPropertyOptional({
    type: String,
  })
  studentId?: string;

  @ApiPropertyOptional({
    type: String,
  })
  companyId?: string;

  @ApiPropertyOptional({
    type: String,
  })
  seasonId?: string;

  @ApiPropertyOptional({
    type: String,
  })
  offerType?: string;

  @ApiPropertyOptional({
    type: String,
  })
  status?: string;

  @ApiPropertyOptional({
    type: String
  })
  id?: string;
}
