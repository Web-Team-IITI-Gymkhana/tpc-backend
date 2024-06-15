import { NestedString, NestedEmail, NestedUUID, NestedObject, NestedEnum, NestedNumber } from "src/decorators/dto";
import { CompanyCategoryEnum, IndustryDomainEnum } from "src/enums";

class AddressDto {
  @NestedString({ optional: true })
  city?: string;

  @NestedString({ optional: true })
  line1?: string;

  @NestedString({ optional: true })
  line2?: string;

  @NestedString({ optional: true })
  state?: string;

  @NestedString({ optional: true })
  country?: string;

  @NestedString({ optional: true })
  zipCode?: string;
}

class UpdateUserDto {
  @NestedString({ optional: true })
  name?: string;

  @NestedEmail({ optional: true })
  email?: string;

  @NestedString({ optional: true })
  contact?: string;
}

class UpdateCompanyDto {
  @NestedString({ optional: true })
  name?: string;

  @NestedString({ optional: true })
  website?: string;

  @NestedEnum(IndustryDomainEnum, { optional: true })
  domains?: IndustryDomainEnum[];

  @NestedEnum(CompanyCategoryEnum, { optional: true })
  category?: CompanyCategoryEnum;

  @NestedObject({ type: AddressDto, optional: true })
  address?: AddressDto;

  @NestedNumber({ optional: true })
  size?: number;

  @NestedString({ optional: true })
  yearOfEstablishment?: string;

  @NestedString({ optional: true })
  annualTurnover?: string;

  @NestedString({ optional: true })
  socialMediaLink?: string;
}

export class UpdateRecruiterDto {
  @NestedString({ optional: true })
  designation?: string;

  @NestedString({ optional: true })
  landline?: string;

  @NestedObject({ type: UpdateCompanyDto, optional: true })
  company?: UpdateCompanyDto;

  @NestedObject({ type: UpdateUserDto, optional: true })
  user?: UpdateUserDto;
}
