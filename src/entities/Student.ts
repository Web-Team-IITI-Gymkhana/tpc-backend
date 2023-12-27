import { StudentModel } from "src/db/models";
import { Gender } from "src/db/enums";
import { User } from "./User";

export class Student {
  id?: string;
  userId: string;
  user: User;
  rollNo: string;
  catagory?: string;
  gender: Gender;
  programId: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    userId: string;
    user: User;
    rollNo: string;
    catagory?: string;
    gender: Gender;
    programId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(student: StudentModel): Student {
    return new this({
      id: student.id,
      userId: student.userId,
      user: student.user && User.fromModel(student.user),
      rollNo: student.rollNo,
      catagory: student.category,
      programId: student.programId,
      gender: student.gender as Gender,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    });
  }
}
