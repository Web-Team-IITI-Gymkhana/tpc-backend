import { Inject, Injectable } from "@nestjs/common";
import { REGISTRATIONS_DAO } from "src/constants";
import { RegistrationModel } from "src/db/models/RegistrationModel";
import { RegistrationsQueryDto } from "./dtos/query.dto";
import { FindOptions } from "sequelize";
import { ProgramModel, SeasonModel, StudentModel, UserModel } from "src/db/models";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateRegistrationsDto } from "./dtos/post.dto";

@Injectable()
export class RegistrationsService {
  constructor(@Inject(REGISTRATIONS_DAO) private registrationsRepo: typeof RegistrationModel) {}

  async getRegistrations(where: RegistrationsQueryDto) {
    const findOptions: FindOptions<RegistrationModel> = {
      include: [
        {
          model: SeasonModel,
          as: "season",
        },
        {
          model: StudentModel,
          as: "student",
          required: true,
          include: [
            {
              model: UserModel,
              as: "user",
            },
            {
              model: ProgramModel,
              as: "program",
            },
          ],
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

  async createRegistrations(registrations: CreateRegistrationsDto[]) {
    registrations = registrations.map((registration) => ({ ...registration, registered: false }));
    const ans = await this.registrationsRepo.bulkCreate(registrations);

    return ans.map((registration) => registration.id);
  }

  async deleteRegistrations(ids: string | string[]) {
    const ans = await this.registrationsRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
