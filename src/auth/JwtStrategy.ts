import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/AuthService";
import { User } from "src/auth/User";
import { RoleEnum } from "src/enums";

interface IPayload {
  sub: string;
  email: string;
  userType: RoleEnum;
  name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private authService: AuthService) {
    super(authService.getJwtOptions());
  }

  async validate(payload: IPayload): Promise<User> {
    return new User({ id: payload.sub, email: payload.email, role: payload.userType, name: payload.name });
  }
}
