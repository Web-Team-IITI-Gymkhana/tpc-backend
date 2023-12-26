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

  async getUserById(id: string, t?: Transaction) {
    const userModel = await this.userRepo.findOne({ where: { id: id }, transaction: t });
    return User.fromModel(userModel);
  }

  async getUserByEmail(email: string, t?: Transaction) {
    const userModel = await this.userRepo.findOne({ where: { email: email }, transaction: t });
    return User.fromModel(userModel);
  }

  async deleteUser(userId: string, t?: Transaction) {
    await this.userRepo.destroy({ where: { id: userId }, transaction: t });
  }
}

export default UserService;
