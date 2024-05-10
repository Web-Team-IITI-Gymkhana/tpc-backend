import { NestedEnum, NestedNumber, NestedString, NestedUUID } from "src/decorators/dto";
import { OfferStatusEnum } from "src/enums";

export class UpdateOffCampusOffersDto {
  @NestedUUID({})
  id: string;

  @NestedUUID({ optional: true })
  studentId?: string;

  @NestedUUID({ optional: true })
  seasonId?: string;

  @NestedUUID({ optional: true })
  companyId?: string;

  @NestedNumber({ optional: true })
  salary?: number;

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedString({ optional: true })
  metadata?: string;

  @NestedString({ optional: true })
  role?: string;

  @NestedEnum(OfferStatusEnum, { optional: true })
  status?: OfferStatusEnum;
}

export class UpdateOnCampusOffersDto {
  @NestedUUID({})
  id: string;

  @NestedUUID({ optional: true })
  studentId?: string;

  @NestedUUID({ optional: true })
  salaryId?: string;

  @NestedString({ optional: true })
  metadata?: string;

  @NestedEnum(OfferStatusEnum, { optional: true })
  status?: OfferStatusEnum;
}
