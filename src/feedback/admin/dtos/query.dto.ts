import { NestedEnum, NestedNumber, NestedObject } from "src/decorators/dto";
import { OrderByEnum, SeasonTypeEnum } from "src/enums";
import {
  createMatchOptionsEnum,
  MatchOptionsString,
  MatchOptionsUUID,
} from "src/utils/utils.dto";

const seasonTypeEnum = createMatchOptionsEnum(SeasonTypeEnum);

/* ================= COMPANY ================= */

class FilterCompanyDto {
  @NestedObject({ type: MatchOptionsString, optional: true })
  name?: MatchOptionsString;
}

class OrderCompanyDto {
  @NestedEnum(OrderByEnum, { optional: true })
  name?: OrderByEnum;
}

/* ================= USER ================= */

class FilterUserDto {
  @NestedObject({ type: MatchOptionsString, optional: true })
  name?: MatchOptionsString;

  @NestedObject({ type: MatchOptionsString, optional: true })
  email?: MatchOptionsString;
}

class OrderUserDto {
  @NestedEnum(OrderByEnum, { optional: true })
  name?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  email?: OrderByEnum;
}

/* ================= RECRUITER ================= */

class FilterRecruiterDto {
  @NestedObject({ type: MatchOptionsString, optional: true })
  designation?: MatchOptionsString;

  @NestedObject({ type: FilterUserDto, optional: true })
  user?: FilterUserDto;
}

class OrderRecruiterDto {
  @NestedEnum(OrderByEnum, { optional: true })
  designation?: OrderByEnum;

  @NestedObject({ type: OrderUserDto, optional: true })
  user?: OrderUserDto;
}

/* ================= SEASON ================= */

class FilterSeasonDto {
  @NestedObject({ type: MatchOptionsString, optional: true })
  year?: MatchOptionsString;

  @NestedObject({ type: seasonTypeEnum, optional: true })
  type?: typeof seasonTypeEnum;
}

class OrderSeasonDto {
  @NestedEnum(OrderByEnum, { optional: true })
  year?: OrderByEnum;

  @NestedEnum(OrderByEnum, { optional: true })
  type?: OrderByEnum;
}

/* ================= FEEDBACK ================= */

class FilterFeedbackDto {
  @NestedObject({ type: MatchOptionsUUID, optional: true })
  id?: MatchOptionsUUID;

  @NestedObject({ type: FilterRecruiterDto, optional: true })
  recruiter?: FilterRecruiterDto;

  @NestedObject({ type: FilterCompanyDto, optional: true })
  company?: FilterCompanyDto;

  @NestedObject({ type: FilterSeasonDto, optional: true })
  season?: FilterSeasonDto;
}

class OrderFeedbackDto {
  @NestedEnum(OrderByEnum, { optional: true })
  createdAt?: OrderByEnum;

  @NestedObject({ type: OrderRecruiterDto, optional: true })
  recruiter?: OrderRecruiterDto;

  @NestedObject({ type: OrderCompanyDto, optional: true })
  company?: OrderCompanyDto;

  @NestedObject({ type: OrderSeasonDto, optional: true })
  season?: OrderSeasonDto;
}

/* ================= ROOT ================= */

export class FeedbackQueryDto {
  @NestedNumber({ optional: true })
  from?: number;

  @NestedNumber({ optional: true })
  to?: number;

  @NestedObject({ type: FilterFeedbackDto, optional: true })
  filterBy?: FilterFeedbackDto;

  @NestedObject({ type: OrderFeedbackDto, optional: true })
  orderBy?: OrderFeedbackDto;
}
