import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserService } from "src/services/UserService";
import { EmailService } from "src/services/EmailService";
import { JwtStrategy } from "./jwt.strategy";
import { GoogleStrategy } from "./google.strategy";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
