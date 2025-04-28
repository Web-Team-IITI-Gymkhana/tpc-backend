import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { ExtractJwt, StrategyOptions } from "passport-jwt";
import { env } from "src/config";
import { IUser } from "./User";
import { RoleEnum } from "src/enums";
import { RecruiterModel, UserModel } from "src/db/models";
import { RECRUITER_DAO, USER_DAO } from "src/constants";
import { CreateRecruitersDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(RECRUITER_DAO) private recruiterRepo: typeof RecruiterModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel
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
