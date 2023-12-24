import { ApiProperty } from "@nestjs/swagger";
import { UserModel } from "src/db/models";
import { Role } from "src/db/enums";

export class User {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  contact?: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  createdAt?: Date;
  @ApiProperty()
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    name: string;
    email: string;
    contact?: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
  }) {
    Object.assign(this, input);
  }

  static fromModel(user: UserModel): User {
    return new this({
      id: user.id,
      name: user.name,
      email: user.email,
      contact: user.contact,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
