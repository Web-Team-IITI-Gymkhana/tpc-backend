import {
  NestedString,
  NestedEmail,
  NestedObject,
  NestedEnum,
  NestedNumber,
  NestedUUID,
  NestedBoolean,
  NestedDate,
} from "src/decorators/dto";
import { CategoryEnum, CompanyCategoryEnum, GenderEnum, IndustryDomainEnum } from "src/enums";
import { SelectionProcedureDto } from "src/job/dtos/jaf.dto";

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

  @NestedEnum(IndustryDomainEnum, { isArray: true, optional: false })
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

export class UpdateSalariesDto {
  @NestedNumber({ optional: true })
  baseSalary?: number;

  @NestedNumber({ optional: true })
  totalCTC?: number;

  @NestedNumber({ optional: true })
  takeHomeSalary?: number;

  @NestedNumber({ optional: true })
  grossSalary?: number;

  @NestedNumber({ optional: true })
  otherCompensations?: number;

  @NestedEnum(GenderEnum, { optional: true, isArray: true })
  genders?: GenderEnum[];

  @NestedUUID({ optional: true, isArray: true })
  programs?: string[];

  @NestedEnum(CategoryEnum, { optional: true, isArray: true })
  categories?: CategoryEnum[];

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedNumber({ optional: true })
  minCPI?: number;

  @NestedNumber({ optional: true })
  tenthMarks?: number;

  @NestedNumber({ optional: true })
  twelthMarks?: number;
}

export class UpdateJobDto {
  @NestedString({ optional: true })
  role?: string;

  @NestedNumber({ optional: true })
  noOfVacancies?: number;

  @NestedString({ optional: true })
  duration?: string;

  @NestedString({ optional: true })
  location?: string;

  @NestedObject({ type: SelectionProcedureDto, optional: true })
  selectionProcedure?: SelectionProcedureDto;

  @NestedString({ optional: true })
  description?: string;

  @NestedString({ optional: true, isArray: true })
  attachments?: string[];

  @NestedString({ optional: true, isArray: true })
  skills?: string[];

  @NestedDate({ optional: true })
  offerLetterReleaseDate?: Date;

  @NestedDate({ optional: true })
  joiningDate?: Date;

  @NestedString({ optional: true })
  feedback?: string;
}
