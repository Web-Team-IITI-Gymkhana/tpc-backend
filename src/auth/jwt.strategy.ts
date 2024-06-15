import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { IUser } from "src/auth/User";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private authService: AuthService) {
    super(authService.getJwtOptions());
  }

  async validate(payload: IUser): Promise<IUser> {
    const ans: IUser = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      facultyId: payload.facultyId,
      recruiterId: payload.recruiterId,
      studentId: payload.studentId,
    };

    return ans;
  }
}
