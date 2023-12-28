import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserModel } from "src/db/models";
import { Role } from "src/db/enums";
import { Exclude } from "class-transformer";

export class User {
  id?: string;
  name: string;
  email: string;
  contact?: string;
  role: Role;
  @Exclude()
  @ApiPropertyOptional({ description: "This is the id in role table eg. studentId for STUDENT" })
  roleId?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    name: string;
    email: string;
    contact?: string;
    role?: Role;
    roleId?: string;
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
