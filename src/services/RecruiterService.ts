import { HttpException, Inject, Injectable, Logger } from "@nestjs/common";
import { includes, omit } from "lodash";
import { Transaction, WhereOptions } from "sequelize";
import { RECRUITER_DAO, RECRUITER_LOGIN_SERVICE, USER_DAO, MAIL_SERVICE, AUTH_SERVICE } from "src/constants";
import { RecruiterModel, UserModel } from "src/db/models";
import { Recruiter } from "src/entities/Recruiter";
import { getQueryValues } from "src/utils/utils";
import RecruiterAuthService from "./RecruiterLoginService";
import { User } from "src/entities/User";
import { EmailService } from "./EmailService";
import AuthService from "./AuthService";

@Injectable()
class RecruiterService {
  private logger = new Logger(RecruiterService.name);

  constructor(
    @Inject(RECRUITER_DAO) private recruiterRepo: typeof RecruiterModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel,
    @Inject(RECRUITER_LOGIN_SERVICE) private recruiterJWT: RecruiterAuthService,
    @Inject(AUTH_SERVICE) private authJWT: AuthService,
    @Inject(MAIL_SERVICE) private emailService: EmailService
  ) {}

  async createRecruiter(recruiter: Recruiter, t?: Transaction) {
    const recruiterModel = await this.recruiterRepo.create(omit(recruiter, "user", "company"), { transaction: t });
    return Recruiter.fromModel(recruiterModel);
  }
  async getOrCreateRecruiter(recruiter: Recruiter, t?: Transaction) {
    const [recruiterModel] = await this.recruiterRepo.findOrCreate({
      where: omit(recruiter, "user", "company"),
      defaults: omit(recruiter, "user", "company"),
      transaction: t,
    });
    return Recruiter.fromModel(recruiterModel);
  }

  async getRecruiters(where?: WhereOptions<RecruiterModel>, t?: Transaction) {
    const values = getQueryValues(where);
    const recruiterModels = await this.recruiterRepo.findAll({
      where: values,
      transaction: t,
      include: { model: UserModel, required: true },
    });
    return recruiterModels.map((recruiterModel) => Recruiter.fromModel(recruiterModel));
  }

  async deleteRecruiter(recruiterId: string, t?: Transaction) {
    return !!(await this.recruiterRepo.destroy({ where: { id: recruiterId }, transaction: t }));
  }

  async updateRecruiter(recruiterId: string, fieldsToUpdate: object, t?: Transaction) {
    const [_, updatedModel] = await this.recruiterRepo.update(fieldsToUpdate, {
      where: { id: recruiterId },
      returning: true,
      transaction: t,
    });
    return Recruiter.fromModel(updatedModel[0]);
  }

  //recruiter will put his email and we will create a jwt encoding his email and send it to him
  async loginRecruiter(email: string, t?: Transaction) {
    try {
      const foundUser = await this.userRepo.findOne({ where: { email }, transaction: t });
      console.log(foundUser);
      if (!foundUser) {
        return { success: false, message: "User not found" };
      }
      if (!includes(foundUser.role, "RECRUITER")) {
        return { error: "User is not a recruiter", status: 403 };
      }
      const token = await this.recruiterJWT.vendJWT(User.fromModel(foundUser));
      //abb mei usko email bhej dunga
      const result = await this.emailService.sendEmail(email, token);
      if (result.status === 404) {
        console.error("Error sending email:", result.error);
        throw new HttpException("Error sending email", 500);
      }
      return { success: true, message: "Email sent succesfully" };
    } catch {
      return { success: false, message: "Error sending mail" };
    }
  }
  // now recruiter will put this token and we will check it
  async checkRecruiterToken(token: string, t?: Transaction) {
    try {
      const user = await this.recruiterJWT.validateJWT(token);
      const auth_token = await this.authJWT.vendJWT(user);
      return { token: auth_token, success: true };
    } catch (err) {
      return { message: "Unauthorized", success: false };
    }
  }
}

export default RecruiterService;
