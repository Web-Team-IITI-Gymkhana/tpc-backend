import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./AuthService";
import { UserService } from "src/services/UserService";
import { EmailService } from "src/services/EmailService";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
