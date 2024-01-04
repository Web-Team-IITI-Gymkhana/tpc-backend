import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class OnCampusOfferIdParamDto {
  @ApiProperty({
    type: String,
  })
  onCampusOfferId: string;
}

export class CreateOnCampusOfferDto {
  @ApiProperty({
    type: String,
  })
  studentId: string;

  @ApiProperty({
    type: String,
  })
  salaryId: string;

  @ApiProperty({
    type: String,
  })
  status: string;
}

export class CreateOnCampusOffersDto {
  @ApiProperty({
    isArray: true,
    type: CreateOnCampusOfferDto,
  })
  onCampusOffers: CreateOnCampusOfferDto[];
}

export class UpdateOnCampusOfferDto {
  @ApiPropertyOptional({
    type: String,
  })
  status?: string;

  @ApiPropertyOptional({
    type: String,
  })
  studentId?: string;

  @ApiPropertyOptional({
    type: String,
  })
  salaryId?: string;
}

export class OnCampusOfferQueryDto {
  @ApiPropertyOptional({
    type: String,
  })
  status?: string;

  @ApiPropertyOptional({
    type: String,
  })
  studentId?: string;

  @ApiPropertyOptional({
    type: String,
  })
  salaryId?: string;

  @ApiPropertyOptional({
    type: String,
  })
  id?: string;
}
