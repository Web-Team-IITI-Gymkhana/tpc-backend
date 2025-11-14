import { NestedString, NestedEnum, NestedUrl, NestedNumber, NestedObject, NestedUUID } from "src/decorators/dto";
import { CompanyCategoryEnum, IndustryDomainEnum } from "src/enums";
import { AddressDto } from "src/job/dtos/jaf.dto";

export class UpdateCompaniesDto {
  @NestedUUID({})
  id: string;

  @NestedString({ optional: true })
  name?: string;

  @NestedEnum(CompanyCategoryEnum, { optional: true })
  category?: CompanyCategoryEnum;

  @NestedString({ optional: true })
  yearOfEstablishment?: string;

  @NestedUrl({ optional: true })
  website?: string;

  @NestedNumber({ optional: true })
  size?: number;

  @NestedString({ optional: true })
  annualTurnover?: string;

  @NestedUrl({ optional: true })
  socialMediaLink?: string;

  @NestedEnum(IndustryDomainEnum, { isArray: true, optional: false })
  domains?: IndustryDomainEnum[];

  @NestedObject({ type: AddressDto, optional: true })
  address?: AddressDto;
}
