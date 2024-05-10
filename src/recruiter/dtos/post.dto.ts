import { NestedEmail, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";

class CreateUserDto {
  @NestedString({})
  name: string;

  @NestedEmail({})
  email: string;

  @NestedString({})
  contact: string;

  role: string;
}

export class CreateRecruitersDto {
  @NestedString({})
  designation: string;

  @NestedString({ optional: true })
  landline?: string;

  @NestedUUID({})
  companyId: string;

  @NestedObject({ type: CreateUserDto })
  user: CreateUserDto;
}
