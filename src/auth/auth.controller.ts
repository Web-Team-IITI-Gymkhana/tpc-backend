import {
  Body,
  Controller,
  Inject,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  HttpException,
} from "@nestjs/common";
import { RECRUITER_SERVICE } from "src/constants";
import RecruiterService from "src/services/RecruiterService";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { PasswordlessLoginDto, PasswordlessLoginVerifyDto } from "./auth.dto";
import { Http } from "winston/lib/winston/transports";

@Controller("/auth")
@ApiBearerAuth("jwt")
// @UseGuards(AuthGuard("jwt"))
export class AuthController {
  constructor(
    @Inject(RECRUITER_SERVICE) private recruiterService: RecruiterService // @Inject(USER_SERVICE) private userService: UserService,
  ) // @Inject(AUTH_SERVICE) private authService: AuthService
  {}

  // @Post("/")
  // @UseInterceptors(ClassSerializerInterceptor)
  // async signup(@Body() body: UserSignUpDto) {
  //   const user = await this.userService.createUser(new User({ name: body.name, email: body.email, role: body.role }));
  //   return { user: user };
  // }

  // @Post("/login")
  // async login(@Body() body: UserLogInDto) {
  //   const user = await this.userService.getUserByEmail(body.email, body.role);
  //   if (!user) {
  //     throw new HttpException(
  //       `User with email ${body.email} and role ${body.role} doesn't exists`,
  //       HttpStatus.NOT_FOUND
  //     );
  //   }
  //   const token = await this.authService.vendJWT(user);
  //   return { accessToken: token };
  // }

  @Post("/passwordless")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async loginRecruiter(@Body() body: PasswordlessLoginDto, @TransactionParam() transaction: Transaction) {
    return await this.recruiterService.loginRecruiter(body.email, transaction);
  }

  @Post("/passwordless/verify")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async checkRecruiterToken(@Body() body: PasswordlessLoginVerifyDto, @TransactionParam() transaction: Transaction) {
    return await this.recruiterService.checkRecruiterToken(body.token, transaction);
  }
}
