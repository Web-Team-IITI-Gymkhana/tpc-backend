import { NestedEmail, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";

class UpdateUserDto {
  @NestedString({ optional: true })
  name?: string;

  @NestedString({ optional: true })
  contact?: string;

  @NestedEmail({ optional: true })
  email?: string;
}

export class UpdateRecuitersDto {
  @NestedUUID({})
  id: string;

  @NestedString({ optional: true })
  designation?: string;

  @NestedString({ optional: true })
  landline?: string;

  @NestedUUID({ optional: true })
  companyId?: string;

  @NestedObject({ type: UpdateUserDto, optional: true })
  user?: UpdateUserDto;
}
