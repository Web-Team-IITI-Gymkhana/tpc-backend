import { RoleEnum } from "src/enums";

export interface IUser {
  id: string;
  email: string;
  role: RoleEnum;
  studentId?: string;
  recruiterId?: string;
  facultyId?: string;
  tpcMemberId?: string;
}
