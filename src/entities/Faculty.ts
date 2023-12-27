import { FacultyModel } from "src/db/models";
import { User } from "./User";

export class Faculty {
  id?: string;
  userId: string;
  user: User;
  department: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    userId: string;
    user: User;
    department: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(faculty: FacultyModel): Faculty {
    return new this({
      id: faculty.id,
      userId: faculty.userId,
      department: faculty.department,
      user: faculty.user && User.fromModel(faculty.user),
      createdAt: faculty.createdAt,
      updatedAt: faculty.updatedAt,
    });
  }
}
