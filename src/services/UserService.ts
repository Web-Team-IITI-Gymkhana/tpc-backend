import { Global, Inject, Injectable, Logger } from "@nestjs/common";
import { Transaction } from "sequelize";
import { USER_DAO } from "src/constants";
import { RoleEnum } from "src/enums";
import { UserModel } from "src/db/models";
import { User } from "../auth/User";

@Global()
@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(@Inject(USER_DAO) private userRepo: typeof UserModel) {}

  async getOrCreateUser(user: User, t?: Transaction) {
    const [userModel] = await this.userRepo.findOrCreate({
      where: { email: user.email, role: user.role },
      defaults: user,
      transaction: t,
    });

    return User.fromModel(userModel);
  }

  async getUserById(id: string, t?: Transaction) {
    const userModel = await this.userRepo.findOne({ where: { id: id }, transaction: t });

    return userModel && User.fromModel(userModel);
  }

  async getUserByEmail(email: string, role: RoleEnum, t?: Transaction) {
    const userModel = await this.userRepo.findOne({ where: { email: email, role: role }, transaction: t });

    return userModel && User.fromModel(userModel);
  }

  async deleteUser(userId: string, t?: Transaction) {
    return !!(await this.userRepo.destroy({ where: { id: userId }, transaction: t }));
  }

  async updateUser(userId: string, fieldsToUpdate: object, t?: Transaction) {
    const [_, updatedModel] = await this.userRepo.update(fieldsToUpdate, {
      where: { id: userId },
      returning: true,
      transaction: t,
    });

    return User.fromModel(updatedModel[0]);
  }
}
