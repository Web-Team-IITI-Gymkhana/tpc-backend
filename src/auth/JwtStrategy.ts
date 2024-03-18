import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import AuthService from "src/services/AuthService";
import { AUTH_SERVICE } from "src/constants";
import { User } from "src/entities/User";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(@Inject(AUTH_SERVICE) authService: AuthService) {
    super(authService.getJwtOptions());
  }

  async validate(payload: any): Promise<User> {
    return new User({ id: payload.sub, email: payload.email, role: payload.userType, name: payload.name });
  }
}
