import { NestedBoolean, NestedUUID } from "src/decorators/dto";

export class CreateRegistrationsDto {
  @NestedUUID({})
  studentId: string;

  @NestedUUID({})
  seasonId: string;

  @NestedBoolean({})
  registered: boolean;
}
