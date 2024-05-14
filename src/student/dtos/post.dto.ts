import { NestedEmail, NestedEnum, NestedNumber, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import { CategoryEnum, GenderEnum, RoleEnum } from "src/enums";

class CreateUserDto {
  @NestedString({})
  name: string;

  @NestedEmail({})
  email: string;

  @NestedString({})
  contact: string;

  role?: RoleEnum;
}

export class CreateStudentsDto {
  @NestedUUID({})
  programId: string;

  @NestedString({})
  rollNo: string;

  @NestedEnum(CategoryEnum, {})
  category: CategoryEnum;

  @NestedEnum(GenderEnum, {})
  gender: GenderEnum;

  @NestedNumber({})
  cpi: number;

  @NestedNumber({})
  tenthMarks: number;

  @NestedNumber({})
  twelthMarks: number;

  @NestedObject({ type: CreateUserDto })
  user: CreateUserDto;
}
