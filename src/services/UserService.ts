import { Global, Inject, Injectable, Logger } from "@nestjs/common";
import { Transaction } from "sequelize";
import { USER_DAO } from "src/constants";
import { RoleEnum } from "src/enums";
import { FacultyModel, RecruiterModel, StudentModel, UserModel } from "src/db/models";
import { IUser } from "src/auth/User";

@Global()
@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(@Inject(USER_DAO) private userRepo: typeof UserModel) {}

  async getUserByEmail(email: string): Promise<IUser> {
    const userModel = await this.userRepo.findOne({
      where: { email: email },
      attributes: ["id", "role"],
      include: [
        {
          model: StudentModel,
          as: "student",
          attributes: ["id"],
        },
        {
          model: RecruiterModel,
          as: "recruiter",
          attributes: ["id"],
        },
        {
          model: FacultyModel,
          as: "faculty",
          attributes: ["id"],
        },
      ],
    });
    if (!userModel) return undefined;

    const ans: IUser = {
      id: userModel.id,
      email: email,
      role: userModel.role,
      studentId: userModel.student?.id,
      recruiterId: userModel.recruiter?.id,
      facultyId: userModel.faculty?.id,
    };

    return ans;
  }
}
