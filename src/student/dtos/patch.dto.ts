import { NestedEmail, NestedEnum, NestedNumber, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import { CategoryEnum, GenderEnum } from "src/enums";

class UpdateUserDto {
  @NestedString({ optional: true })
  name?: string;

  @NestedEmail({ optional: true })
  email?: string;

  @NestedString({ optional: true })
  contact?: string;
}

export class UpdateStudentsDto {
  @NestedUUID({})
  id: string;

  @NestedUUID({ optional: true })
  programId?: string;

  @NestedString({ optional: true })
  rollNo?: string;

  @NestedEnum(CategoryEnum, { optional: true })
  category?: CategoryEnum;

  @NestedEnum(GenderEnum, { optional: true })
  gender?: GenderEnum;

  @NestedNumber({ optional: true })
  cpi?: number;

  @NestedNumber({ optional: true })
  tenthMarks?: number;

  @NestedNumber({ optional: true })
  twelthMarks?: number;

  @NestedObject({ type: UpdateUserDto, optional: true })
  user?: UpdateUserDto;
}
