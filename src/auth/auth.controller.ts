/* eslint-disable no-console */
import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  HttpException,
  NotFoundException,
  UseGuards,
  Get,
  UnauthorizedException,
  Res,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  CreateRecruitersDto,
  PasswordlessLoginDto,
  PasswordlessLoginVerifyDto,
  UserLogInDto,
  UserSignUpDto,
} from "./auth.dto";
import { UserService } from "src/services/UserService";
import { AuthService } from "./auth.service";
import { RoleEnum } from "src/enums";
import { AuthGuard } from "@nestjs/passport";
import { EmailService } from "src/services/EmailService";
import { env } from "src/config";
import { Response } from "express";
import { assert } from "console";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { isProductionEnv } from "src/utils";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { verifyRecaptcha } from "src/utils/recaptcha";

@Controller("auth")
@ApiTags("Auth")
@ApiBearerAuth("jwt")
export class AuthController {
  private recruiterSecret = env().RECRUITER_SECRET;
  private frontendUrl = env().FRONTEND_URL;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private emailService: EmailService
  ) {}

  @Post("login")
  async login(@Body() body: UserLogInDto): Promise<{ accessToken: string }> {
    // Devlogin only in development mode
    if (isProductionEnv()) {
      throw new HttpException("Dev login is not available", HttpStatus.FORBIDDEN);
    }

    const user = await this.userService.getUserByEmail(body.email);
    if (!user) {
      throw new HttpException(
        `User with email ${body.email} and role ${body.role} doesn't exists`,
        HttpStatus.NOT_FOUND
      );
    }
    const token = await this.authService.vendJWT(user);

    return { accessToken: token };
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 2, ttl: 60 * 1000 } })
  @Post("passwordless")
  @UseInterceptors(ClassSerializerInterceptor)
  async loginRecruiter(@Body() body: PasswordlessLoginDto): Promise<string> {
    const verified = await verifyRecaptcha(body.token);

    if (!verified) {
      throw new ForbiddenException("Invalid captcha");
    }

    if (!body.email) {
      throw new HttpException("Email is required", HttpStatus.BAD_REQUEST);
    }
    1;

    const user = await this.userService.getUserByEmail(body.email);
    if (!user || !(user.role === RoleEnum.RECRUITER || user.role === RoleEnum.ADMIN))
      throw new ForbiddenException(`The user with email ${body.email} and Role ${RoleEnum.RECRUITER} Not Found`);
    const jwt = await this.authService.vendJWT(user, this.recruiterSecret);
    const res = await this.emailService.sendTokenEmail(user.email, jwt);
    if (!res) throw new HttpException("Error sending email", HttpStatus.INTERNAL_SERVER_ERROR);

    return JSON.stringify({
      success: true,
      message: "Email Sent Successfully",
    });
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 2, ttl: 60 * 1000 } })
  @Post("recruiter")
  @UseInterceptors(ClassSerializerInterceptor)
  async signupRecruiter(@Body() body: CreateRecruitersDto): Promise<{ success: boolean; message: string }> {
    const user = await this.authService.createRecruiter(body);
    const jwt = await this.authService.vendJWT(user, this.recruiterSecret);
    const res = await this.emailService.sendTokenEmail(user.email, jwt);
    if (!res) throw new HttpException("Error sending email", HttpStatus.INTERNAL_SERVER_ERROR);

    return {
      success: true,
      message: "Email Sent Successfully",
    };
  }

  @Post("passwordless/verify")
  @UseInterceptors(ClassSerializerInterceptor)
  async checkRecruiterToken(@Body() body: PasswordlessLoginVerifyDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.parseJWT(body.token, this.recruiterSecret);

    if (!user) throw new UnauthorizedException(`User not found`);
    const token = await this.authService.vendJWT(user);

    return JSON.stringify({ accessToken: token });
  }

  @Get("google/login")
  @UseGuards(AuthGuard("google"))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Req() req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
    assert(req.user !== undefined, "Google did not provide an email");

    const user = await this.userService.getUserByEmail(req.user.email);
    if (!user) {
      throw new UnauthorizedException(`User with email ${req.user.email} not found`);
    }
    const token = await this.authService.vendJWT(user);
    res.cookie("accessToken", token, { httpOnly: false });
    res.cookie("user", JSON.stringify(jwtDecode(token)), {
      httpOnly: false,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    res.redirect(this.frontendUrl);
  }

  @Post("verify-captcha")
  async verifyCaptcha(@Body() body: { token: string }) {
    const verified = await verifyRecaptcha(body.token);

    if (!verified) {
      throw new ForbiddenException("Invalid captcha");
    }

    return JSON.stringify({ success: true, message: "Captcha verified successfully" });
  }
}
