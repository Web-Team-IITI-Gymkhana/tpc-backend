import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { User } from "./User";
import * as jwt from "jsonwebtoken";
import { ExtractJwt, StrategyOptions } from "passport-jwt";
import { env } from "src/config";

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  private secretKey = env().USER_SECRET;
  private issuer = "tpc.iiti.ac.in";
  private audience = "tpc-backend";
  private expiry = 7 * 24 * 60 * 60;
  private algorithm: jwt.Algorithm = "HS256";

  async vendJWT(user: User, secretKey?: string) {
    const payload = {
      id: user.id,
      userType: user.role,
      email: user.email,
      name: user.name,
    };
    const options: jwt.SignOptions = {
      expiresIn: this.expiry,
      subject: user.id,
      audience: this.audience,
      issuer: this.issuer,
      algorithm: this.algorithm,
    };

    return jwt.sign(payload, secretKey || this.secretKey, options);
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

      return new User({ id: payload.sub, email: payload.email, role: payload.userType, name: payload.name });
    } catch (err) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
  }
}
