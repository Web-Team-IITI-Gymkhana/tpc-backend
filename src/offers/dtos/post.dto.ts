import { NestedEnum, NestedNumber, NestedString, NestedUUID } from "src/decorators/dto";
import { OfferStatusEnum } from "src/enums";

export class CreateOffCampusOffersDto {
  @NestedUUID({})
  studentId: string;

  @NestedUUID({})
  seasonId: string;

  @NestedUUID({})
  companyId: string;

  @NestedNumber({})
  salary: number;

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedString({ optional: true })
  metadata?: string;

  @NestedString({})
  role: string;

  @NestedEnum(OfferStatusEnum, {})
  status: OfferStatusEnum;
}

export class CreateOnCampusOffersDto {
  @NestedUUID({})
  studentId: string;

  @NestedUUID({})
  salaryId: string;

  @NestedEnum(OfferStatusEnum, {})
  status: OfferStatusEnum;
}
