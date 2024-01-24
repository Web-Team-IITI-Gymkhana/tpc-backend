import { StudentModel } from "src/db/models";
import { Gender, Category } from "src/db/enums";
import { User } from "./User";

export class Student {
  id?: string;
  userId: string;
  user?: User;
  rollNo: string;
  category?: Category;
  cpi: number;
  gender: Gender;
  programId: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    userId: string;
    user?: User;
    rollNo: string;
    category?: Category;
    gender: Gender;
    programId: string;
    createdAt?: Date;
    updatedAt?: Date;
    cpi: number;
  }) {
    Object.assign(this, input);
  }

  static fromModel(student: StudentModel): Student {
    return new this({
      id: student.id,
      cpi: student.cpi,
      userId: student.userId,
      user: student.user && User.fromModel(student.user),
      rollNo: student.rollNo,
      category: student.category as Category,
      programId: student.programId,
      gender: student.gender as Gender,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    });
  }
}
