import { Body, Controller, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { DeleteValues, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { UsersQueryDto } from "./dtos/query.dto";
import { GetUsersDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { CreateUsersDto } from "./dtos/post.dto";
import { UpdateUsersDto } from "./dtos/patch.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";

@Controller("users")
@ApiTags("User")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
export class UserController {
  constructor(private userService: UserService) {}

  @GetValues(UsersQueryDto, GetUsersDto)
  async getUsers(@Query("q") where: UsersQueryDto) {
    const ans = await this.userService.getUsers(where);

    return pipeTransformArray(ans, GetUsersDto);
  }

  @PostValues(CreateUsersDto)
  async createUsers(@Body(createArrayPipe(CreateUsersDto)) users: CreateUsersDto[]) {
    const ans = await this.userService.createUsers(users);

    return ans;
  }

  @PatchValues(UpdateUsersDto)
  async updateUsers(@Body(createArrayPipe(UpdateUsersDto)) users: UpdateUsersDto[]) {
    const pr = users.map((user) => this.userService.updateUser(user));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @DeleteValues()
  async deleteUsers(@Query() query: DeleteValuesDto) {
    const ans = await this.userService.deleteUsers(query.id);

    return ans;
  }
}
