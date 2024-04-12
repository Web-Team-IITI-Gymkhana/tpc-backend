import { Injectable, Inject } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { REGISTRATIONS_DAO } from "src/constants";
import { SeasonModel, StudentModel, UserModel } from "src/db/models";
import { RegistrationModel } from "src/db/models/RegistrationModel";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";

@Injectable()
export class RegistrationsService {
  constructor(@Inject(REGISTRATIONS_DAO) private registrationsRepo: typeof RegistrationModel) {}

  async getRegistrations(where) {
    const findOptions: FindOptions<RegistrationModel> = {
      include: [
        {
          model: StudentModel,
          as: "student",
          required: true,
          include: [
            {
              model: UserModel,
              as: "user",
            },
          ],
        },
        {
          model: SeasonModel,
          as: "season",
        },
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);

    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.registrationsRepo.findAll(findOptions);

    return ans.map((registration) => registration.get({ plain: true }));
  }

  async createRegistrations(registrations) {
    const ans = await this.registrationsRepo.bulkCreate(registrations);

    return ans.map((registration) => registration.id);
  }

  async deleteRegistrations(ids: string[]) {
    const ans = await this.registrationsRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
