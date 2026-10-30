import { NestedString, NestedUUID, NestedEnum, NestedNumber, NestedBoolean, NestedDate } from "src/decorators/dto";
import { CategoryEnum, GenderEnum, DepartmentEnum } from "src/enums";

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

  @NestedEnum(DepartmentEnum, { optional: true, isArray: true })
  facultyApprovals?: DepartmentEnum[];

  @NestedEnum(CategoryEnum, { optional: true, isArray: true })
  categories?: CategoryEnum[];

  @NestedNumber({ optional: true })
  minCPI?: number;

  @NestedNumber({ optional: true })
  tenthMarks?: number;

  @NestedNumber({ optional: true })
  twelthMarks?: number;

  @NestedNumber({ optional: true })
  stipend?: number;

  @NestedString({ optional: true })
  foreignCurrencyStipend?: string;

  @NestedBoolean({ optional: true })
  accommodation?: boolean;

  @NestedBoolean({ optional: true })
  ppoProvisionOnPerformance?: boolean;

  @NestedNumber({ optional: true })
  tentativeCTC?: number;

  @NestedDate({ optional: true })
  PPOConfirmationDate?: Date;

  @NestedNumber({ optional: true })
  joiningBonus?: number;

  @NestedNumber({ optional: true })
  performanceBonus?: number;

  @NestedNumber({ optional: true })
  relocation?: number;

  @NestedNumber({ optional: true })
  bondAmount?: number;

  @NestedNumber({ optional: true })
  esopAmount?: number;

  @NestedString({ optional: true })
  esopVestPeriod?: string;

  @NestedNumber({ optional: true })
  firstYearCTC?: number;

  @NestedNumber({ optional: true })
  retentionBonus?: number;

  @NestedNumber({ optional: true })
  deductions?: number;

  @NestedNumber({ optional: true })
  medicalAllowance?: number;

  @NestedString({ optional: true })
  bondDuration?: string;

  @NestedNumber({ optional: true })
  foreignCurrencyCTC?: number;

  @NestedString({ optional: true })
  foreignCurrencyCode?: string;
}

