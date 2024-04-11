import { Injectable, Inject } from "@nestjs/common/decorators";
import { FindOptions } from "sequelize";
import { USER_DAO } from "src/constants";
import { UserModel } from "src/db/models";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";

@Injectable()
export class UserService {
  constructor(@Inject(USER_DAO) private userRepo: typeof UserModel) {}

  async getUsers(where) {
    const findOptions: FindOptions<UserModel> = {};

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);

    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.userRepo.findAll(findOptions);

    return ans.map((user) => user.get({ plain: true }));
  }

  async createUsers(users) {
    const ans = await this.userRepo.bulkCreate(users);

    return ans.map((user) => user.id);
  }

  async deleteUsers(ids: string[]) {
    const ans = await this.userRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
