import { NestedString, NestedEnum, NestedUrl, NestedNumber, NestedObject } from "src/decorators/dto";
import { CompanyCategoryEnum, IndustryDomainEnum } from "src/enums";
import { AddressDto } from "src/job/dtos/jaf.dto";

export class CreateCompaniesDto {
  @NestedString({})
  name: string;

  @NestedEnum(CompanyCategoryEnum, {})
  category: CompanyCategoryEnum;

  @NestedString({})
  yearOfEstablishment: string;

  @NestedUrl({ optional: true })
  website?: string;

  @NestedNumber({ optional: true })
  size?: number;

  @NestedString({ optional: true })
  annualTurnover?: string;

  @NestedUrl({ optional: true })
  socialMediaLink?: string;

  @NestedEnum(IndustryDomainEnum, { isArray: true })
  domains: IndustryDomainEnum[];

  @NestedObject({ type: AddressDto })
  address: AddressDto;
}
