import { Inject, Injectable } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { PROGRAM_DAO } from "src/constants";
import { ProgramModel } from "src/db/models";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";

@Injectable()
export class ProgramService {
  constructor(@Inject(PROGRAM_DAO) private programRepo: typeof ProgramModel) {}

  async getPrograms(where) {
    const findOptions: FindOptions<ProgramModel> = {};

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.programRepo.findAll(findOptions);

    return ans.map((program) => program.get({ plain: true }));
  }

  async createPrograms(programs) {
    const ans = await this.programRepo.bulkCreate(programs);

    return ans.map((program) => program.id);
  }

  async deletePrograms(ids: string[]) {
    const ans = await this.programRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
