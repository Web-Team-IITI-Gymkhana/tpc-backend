import { TpcMemberRole } from "src/db/enums";
import { User } from "./User";
import { TpcMemberModel } from "src/db/models";

export class TpcMember {
  id?: string;
  userId: string;
  user?: User;
  department: string;
  role: TpcMemberRole;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    userId: string;
    user?: User;
    department: string;
    role: TpcMemberRole;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(model: TpcMemberModel): TpcMember {
    return new this({
      id: model.id,
      userId: model.userId,
      department: model.department,
      role: model.role as TpcMemberRole,
      user: model.user && User.fromModel(model.user),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
