import { NestedString, NestedUUID, NestedEnum, NestedNumber } from "src/decorators/dto";
import { CategoryEnum, GenderEnum } from "src/enums";

export class UpdateSalariesDto {
  @NestedUUID({ optional: true })
  id?: string;

  @NestedUUID({ optional: true })
  jobId?: string;

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedString({ optional: true })
  others?: string;

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

  @NestedNumber({ optional: true })
  minCPI?: number;

  @NestedNumber({ optional: true })
  tenthMarks?: number;

  @NestedNumber({ optional: true })
  twelthMarks?: number;
}
