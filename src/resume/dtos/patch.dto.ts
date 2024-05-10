import { NestedBoolean, NestedUUID } from "src/decorators/dto";

export class UpdateResumesDto {
  @NestedUUID({})
  id: string;

  @NestedBoolean({})
  verified: boolean;
}
