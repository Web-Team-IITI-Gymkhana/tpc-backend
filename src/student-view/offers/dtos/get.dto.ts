import { NestedEnum, NestedNumber, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import { CompanyCategoryEnum, OfferStatusEnum, SeasonTypeEnum } from "src/enums";

class SeasonDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;
}

class CompanyDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;

  @NestedEnum(CompanyCategoryEnum, {})
  category: CompanyCategoryEnum;
}

class JobDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: string;

  @NestedString({ optional: true })
  others?: string;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;
}

class SalaryDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  baseSalary: number;

  @NestedNumber({})
  totalCTC: number;

  @NestedNumber({})
  takeHomeSalary: number;

  @NestedNumber({})
  grossSalary: number;

  @NestedNumber({})
  otherCompensations: number;

  @NestedString({ optional: true })
  others?: string;

  @NestedObject({ type: JobDto })
  job: JobDto;
}

export class GetOffCampusOffersDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: string;

  @NestedNumber({})
  salary: number;

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedString({ optional: true })
  metadata?: string;

  @NestedEnum(OfferStatusEnum, {})
  status: OfferStatusEnum;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;
}

export class GetOnCampusOffersDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(OfferStatusEnum, {})
  status: OfferStatusEnum;

  @NestedString({ optional: true })
  metadata?: string;

  @NestedObject({ type: SalaryDto })
  salary: SalaryDto;
}
