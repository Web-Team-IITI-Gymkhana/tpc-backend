import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { ExtractJwt, StrategyOptions } from "passport-jwt";
import { env } from "src/config";
import { IUser } from "./User";
import { RoleEnum } from "src/enums";
import { JobModel, RecruiterModel, SalaryModel, UserModel } from "src/db/models";
import { JOB_DAO, RECRUITER_DAO, SALARY_DAO, USER_DAO } from "src/constants";
import { CreateRecruiterWithJafDto, CreateRecruitersDto } from "./auth.dto";
import { Transaction } from "sequelize";

@Injectable()
export class AuthService {
  constructor(
    @Inject(RECRUITER_DAO) private recruiterRepo: typeof RecruiterModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel,
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel
  ) {}

  private logger = new Logger(AuthService.name);
  private secretKey = env().USER_SECRET;
  private issuer = "placement.iiti.ac.in";
  private audience = "tpc-backend";
  private expiry = 7 * 24 * 60 * 60;
  private algorithm: jwt.Algorithm = "HS256";

  async vendJWT(user: IUser, secretKey?: string) {
    const options: jwt.SignOptions = {
      expiresIn: this.expiry,
      subject: user.email,
      audience: this.audience,
      issuer: this.issuer,
      algorithm: this.algorithm,
    };

    return jwt.sign(user, secretKey || this.secretKey, options);
  }

  getJwtOptions(): StrategyOptions {
    return {
      secretOrKey: this.secretKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: this.issuer,
      audience: this.audience,
      algorithms: [this.algorithm],
      ignoreExpiration: false,
    };
  }

  async createRecruiter(body) {
    const user = await this.userRepo.findOne({
      where: {
        email: body.user.email,
      },
    });

    if (user) throw new HttpException("Email already exist", HttpStatus.INTERNAL_SERVER_ERROR);

    body.user.role = RoleEnum.RECRUITER;

    const recruiter = await this.recruiterRepo.create(body, {
      include: [{ model: UserModel, as: "user" }],
    });

    const ans: IUser = {
      id: recruiter.user.id,
      email: recruiter.user.email,
      role: RoleEnum.RECRUITER,
      recruiterId: recruiter.id,
    };

    return ans;
  }

  async createRecruiterWithJaf(body: CreateRecruiterWithJafDto, t: Transaction) {
    const user = await this.userRepo.findOne({
      where: {
        email: body.user.email,
      },
    });

    if (user) throw new HttpException("Email already exist", HttpStatus.INTERNAL_SERVER_ERROR);

    const recruiterPayload = {
      ...body,
      user: {
        ...body.user,
        role: RoleEnum.RECRUITER,
      },
    };

    const recruiter = await this.recruiterRepo.create(recruiterPayload, {
      include: [{ model: UserModel, as: "user" }],
      transaction: t,
    });

    const jobPayload = {
      ...body.jaf.job,
      recruiterId: recruiter.id,
      companyId: body.companyId,
    };

    const job = await this.jobRepo.create(jobPayload, {
      transaction: t,
    });

    const salaries = (body.jaf.salaries || []).map((salary) => ({
      ...salary,
      jobId: job.id,
    }));

    if (salaries.length > 0) {
      await this.salaryRepo.bulkCreate(salaries, {
        transaction: t,
      });
    }

    const ans: IUser = {
      id: recruiter.user.id,
      email: recruiter.user.email,
      role: RoleEnum.RECRUITER,
      recruiterId: recruiter.id,
    };

    return ans;
  }

  async parseJWT(token: string, secretKey?: string) {
    try {
      const payload = jwt.verify(token, secretKey || this.secretKey, {
        algorithms: [this.algorithm],
        audience: this.audience,
        issuer: this.issuer,
      }) as jwt.JwtPayload;
      if (!payload) {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      const ans: IUser = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        recruiterId: payload.recruiterId,
      };

      return ans;
    } catch (err) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
  }
}
