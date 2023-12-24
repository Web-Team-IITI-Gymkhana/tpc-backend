import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transaction } from "sequelize";
import { USER_DAO } from "src/constants";
import { UserModel } from "src/db/models";
import { User } from "src/entities/User";
@Injectable()
class UserService {
  private logger = new Logger(UserService.name);

  constructor(@Inject(USER_DAO) private userRepo: typeof UserModel) {}

  async createUser(user: User, t?: Transaction) {
    const userModel = await this.userRepo.create(user, { transaction: t });
    return User.fromModel(userModel);
  }

  async deleteUser(userId: string, t?: Transaction) {
    await this.userRepo.destroy({ where: { id: userId }, transaction: t });
  }
}

export default UserService;
