import { Controller, Get, Post, Delete, Query, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { QueryUserDto } from "./dtos/query.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { CreateUserDto } from "./dtos/post.dto";
import { ReturnUserDto } from "./dtos/get.dto";

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(@Query("q") where: QueryUserDto) {
    const ans = await this.userService.getUsers(where);

    return pipeTransformArray(ans, ReturnUserDto);
  }

  @Post()
  async createUsers(@Body(createArrayPipe(CreateUserDto)) users: CreateUserDto[]) {
    const ans = await this.userService.createUsers(users);

    return ans;
  }

  @Delete()
  async deleteUsers(@Query("id") ids: string | string[]) {
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.userService.deleteUsers(pids);

    return ans;
  }
}
