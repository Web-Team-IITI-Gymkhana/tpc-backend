import {
  Body,
  Controller,
  Inject,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { UserLogInDto, UserSignUpDto } from "./auth.dto";
import { User } from "src/entities/User";
import { AUTH_SERVICE, USER_SERVICE } from "src/constants";
import UserService from "src/services/UserService";
import AuthService from "src/services/AuthService";

@Controller("/auth")
export class AuthController {
  constructor(
    @Inject(USER_SERVICE) private userService: UserService,
    @Inject(AUTH_SERVICE) private authService: AuthService
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
}
