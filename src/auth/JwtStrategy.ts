import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/AuthService";
import { User } from "src/auth/User";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private authService: AuthService) {
    super(authService.getJwtOptions());
  }

  async validate(payload: any): Promise<User> {
    return new User({ id: payload.sub, email: payload.email, role: payload.userType, name: payload.name });
  }
}
