import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { User } from "src/entities/User";
import * as jwt from "jsonwebtoken";
import { ExtractJwt, StrategyOptions } from "passport-jwt";
import { randomUUID } from "crypto";

@Injectable()
class RecruiterAuthService {
  private logger = new Logger(RecruiterAuthService.name);
  private secretKey = process.env.RECRUITER_SECRET;
  private audience = "tpc-backend";
  private expiry = 5 * 60 * 60;
  private algorithm: jwt.Algorithm = "HS256";

  constructor() {}

  async vendJWT(user: User) {
    const payload = {
      userType: user.role,
      email: user.email,
      id: user.id,
      name: user.name,
    };
    const options: jwt.SignOptions = {
      expiresIn: this.expiry,
      subject: user.id,
      audience: this.audience,
      algorithm: this.algorithm,
    };
    return jwt.sign(payload, this.secretKey, options);
  }

  getJwtOptions(): StrategyOptions {
    return {
      secretOrKey: this.secretKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: this.audience,
      algorithms: [this.algorithm],
      ignoreExpiration: false,
    };
  }

  async parseJWT(token: string) {
    try {
      const payload = jwt.verify(token, this.secretKey, {
        algorithms: [this.algorithm],
        audience: this.audience,
      }) as jwt.JwtPayload;
      if (!payload) {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }
      return new User({
        id: payload["id"],
        email: payload["email"],
        role: payload["userType"],
        name: payload["name"],
      });
    } catch (err) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
  }

  async validateJWT(token: string) {
    try {
      const foundUser = await this.parseJWT(token);
      return foundUser;
    } catch {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
  }
}

export default RecruiterAuthService;
