import { Inject, Injectable } from "@nestjs/common";
import { USER_DAO } from "src/constants";
import { UserModel } from "src/db/models";
import { UsersQueryDto } from "./dtos/query.dto";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { FindOptions } from "sequelize";
import { CreateStudentsDto } from "src/student/dtos/post.dto";
import { UpdateUsersDto } from "./dtos/patch.dto";
import { CreateUsersDto } from "./dtos/post.dto";

@Injectable()
export class UserService {
  constructor(@Inject(USER_DAO) private userRepo: typeof UserModel) {}

  async getUsers(where: UsersQueryDto) {
    const findOptions: FindOptions<UserModel> = {};

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.userRepo.findAll(findOptions);

    return ans.map((user) => user.get({ plain: true }));
  }

  async createUsers(users: CreateUsersDto[]) {
    const ans = await this.userRepo.bulkCreate(users);

    return ans.map((user) => user.id);
  }

  async updateUser(user: UpdateUsersDto) {
    const [ans] = await this.userRepo.update(user, { where: { id: user.id } });

    return ans > 0 ? [] : [user.id];
  }

  async deleteUsers(ids: string[] | string) {
    const ans = await this.userRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
