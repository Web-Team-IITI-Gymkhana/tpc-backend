import { ApiProperty } from "@nestjs/swagger";
import { UserModel } from "src/db/models";
import { Role } from "src/db/enums";

export class User {
  id?: string;
  name: string;
  email: string;
  contact?: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    name: string;
    email: string;
    contact?: string;
    role?: Role;
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
      role: user.role as Role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
