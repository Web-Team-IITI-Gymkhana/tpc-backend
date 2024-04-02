import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  HttpException,
  NotFoundException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PasswordlessLoginDto, PasswordlessLoginVerifyDto, UserLogInDto, UserSignUpDto } from "./auth.dto";
import { UserService } from "src/services/UserService";
import { User } from "./User";
import { AuthService } from "./AuthService";
import { RoleEnum } from "src/enums";
import { EmailService } from "src/services/EmailService";
import { env } from "src/config";

@Controller("/auth")
@ApiTags("Auth")
@ApiBearerAuth("jwt")
export class AuthController {
  recruiterSecret = env().RECRUITER_SECRET;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private emailService: EmailService
  ) {}

  @Post("/")
  @UseInterceptors(ClassSerializerInterceptor)
  async signup(@Body() body: UserSignUpDto) {
    const user = await this.userService.createUser(new User({ name: body.name, email: body.email, role: body.role }));

    return { user: user };
  }

  @Post("/login")
  async login(@Body() body: UserLogInDto) {
    const user = await this.userService.getUserByEmail(body.email, body.role);
    if (!user) {
      throw new HttpException(
        `User with email ${body.email} and role ${body.role} doesn't exists`,
        HttpStatus.NOT_FOUND
      );
    }
    const token = await this.authService.vendJWT(user);

    return { accessToken: token };
  }

  @Post("/passwordless")
  @UseInterceptors(ClassSerializerInterceptor)
  async loginRecruiter(@Body() body: PasswordlessLoginDto) {
    const user = await this.userService.getUserByEmail(body.email, RoleEnum.RECRUITER);
    if (!user)
      throw new NotFoundException(`The user with email ${body.email} and Role ${RoleEnum.RECRUITER} Not Found`);
    const jwt = await this.authService.vendJWT(user, this.recruiterSecret);
    const res = await this.emailService.sendEmail(user.email, jwt);

    return "Email Sent Successfully";
  }

  @Post("/passwordless/verify")
  @UseInterceptors(ClassSerializerInterceptor)
  async checkRecruiterToken(@Body() body: PasswordlessLoginVerifyDto) {
    const user = await this.authService.parseJWT(body.token, this.recruiterSecret);
    const authToken = await this.authService.vendJWT(user);

    return authToken;
  }
}
