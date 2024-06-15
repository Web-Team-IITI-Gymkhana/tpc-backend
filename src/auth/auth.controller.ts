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
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PasswordlessLoginDto, PasswordlessLoginVerifyDto, UserLogInDto, UserSignUpDto } from "./auth.dto";
import { UserService } from "src/services/UserService";
import { AuthService } from "./auth.service";
import { RoleEnum } from "src/enums";
import { AuthGuard } from "@nestjs/passport";
import { EmailService } from "src/services/EmailService";
import { env } from "src/config";
import { Response } from "express";
import { assert } from "console";

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
  async login(@Body() body: UserLogInDto) {
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

  @Post("passwordless")
  @UseInterceptors(ClassSerializerInterceptor)
  async loginRecruiter(@Body() body: PasswordlessLoginDto) {
    const user = await this.userService.getUserByEmail(body.email);
    if (!user)
      throw new NotFoundException(`The user with email ${body.email} and Role ${RoleEnum.RECRUITER} Not Found`);
    const jwt = await this.authService.vendJWT(user, this.recruiterSecret);
    const res = await this.emailService.sendTokenEmail(user.email, jwt);

    return "Email Sent Successfully";
  }

  @Post("passwordless/verify")
  @UseInterceptors(ClassSerializerInterceptor)
  async checkRecruiterToken(@Body() body: PasswordlessLoginVerifyDto) {
    const user = await this.authService.parseJWT(body.token, this.recruiterSecret);
    const authToken = await this.authService.vendJWT(user);

    return authToken;
  }

  @Get("google/login")
  @UseGuards(AuthGuard("google"))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Req() req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
    console.log("req.user", req.user);

    assert(req.user !== undefined, "Google did not provide an email");

    const user = await this.userService.getUserByEmail(req.user.email);
    if (!user) throw new UnauthorizedException(`User not found`);
    const token = await this.authService.vendJWT(user);
    res.cookie("jwt", token, { httpOnly: true });
    res.redirect(this.frontendUrl);
  }
}
