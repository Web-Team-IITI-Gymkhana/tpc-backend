import { Body, Controller, Inject, Post, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { UserSignUpDto } from "./auth.dto";
import { User } from "src/entities/User";
import { USER_SERVICE } from "src/constants";
import UserService from "src/services/UserService";

@Controller("/auth")
export class AuthController {
  constructor(@Inject(USER_SERVICE) private userService: UserService) {}

  @Post("/")
  @UseInterceptors(ClassSerializerInterceptor)
  async signup(@Body() body: UserSignUpDto) {
    const user = await this.userService.createUser(new User({ name: body.name, email: body.email, role: body.role }));
    return { user: user };
  }
}
