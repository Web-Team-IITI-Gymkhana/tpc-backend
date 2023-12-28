import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { User } from "src/entities/User";
import * as jwt from "jsonwebtoken";
import { ExtractJwt, StrategyOptions } from "passport-jwt";
import { RECRUITER_SERVICE, STUDENT_SERVICE, TPC_MEMBER_SERVICE } from "src/constants";
import StudentService from "./StudentService";
import RecruiterService from "./RecruiterService";
import TpcMemberService from "./TpcMemberService";
import { Role } from "src/db/enums";

@Injectable()
class AuthService {
  private logger = new Logger(AuthService.name);
  private secretKey = "secret";
  private issuer = "tpc.iiti.ac.in";
  private audience = "tpc-backend";
  private expiry = 7 * 24 * 60 * 60;
  private algorithm: jwt.Algorithm = "HS256";

  constructor(
    @Inject(STUDENT_SERVICE) private studentService: StudentService,
    @Inject(RECRUITER_SERVICE) private recruiterService: RecruiterService,
    @Inject(TPC_MEMBER_SERVICE) private tpcMemberService: TpcMemberService
  ) {}

  async getRoleIdForUser(user: User): Promise<string | undefined> {
    switch (user.role) {
      case Role.STUDENT:
        const [student] = await this.studentService.getStudents({ userId: user.id });
        return student.id;
      case Role.RECRUITER:
        const [recruiter] = await this.recruiterService.getRecruiters({ userId: user.id });
        return recruiter.id;
      case Role.TPC_MEMBER:
        const [tpcMember] = await this.tpcMemberService.getTpcMembers({ userId: user.id });
        return tpcMember.id;
      default:
        return;
    }
  }

  async vendJWT(user: User) {
    const payload = {
      role: user.role,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
    };
    const options: jwt.SignOptions = {
      expiresIn: this.expiry,
      subject: user.id,
      audience: this.audience,
      issuer: this.issuer,
      algorithm: this.algorithm,
    };
    return jwt.sign(payload, this.secretKey, options);
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

  parsePayload(payload: any) {
    return new User({
      id: payload.sub,
      email: payload["email"],
      role: payload["role"],
      name: payload["name"],
      roleId: payload["roleId"],
    });
  }
}

export default AuthService;
