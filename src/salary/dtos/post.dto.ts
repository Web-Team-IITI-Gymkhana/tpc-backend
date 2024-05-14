import { NestedEnum, NestedNumber, NestedString, NestedUUID } from "src/decorators/dto";
import { CategoryEnum, GenderEnum } from "src/enums";

export class CreateSalariesDto {
  @NestedUUID({})
  jobId: string;

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedString({ optional: true })
  others?: string;

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
