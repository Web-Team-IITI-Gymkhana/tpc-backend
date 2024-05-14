import { Inject, Injectable } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { PROGRAM_DAO } from "src/constants";
import { ProgramModel } from "src/db/models";
import { parsePagesize, parseFilter, parseOrder } from "src/utils";
import { ProgramsQueryDto } from "./dtos/query.dto";
import { CreateProgramsDto } from "./dtos/post.dto";
import { UpdateProgramsDto } from "./dtos/patch.dto";

@Injectable()
export class ProgramService {
  constructor(@Inject(PROGRAM_DAO) private programRepo: typeof ProgramModel) {}

  async getPrograms(where: ProgramsQueryDto) {
    const findOptions: FindOptions<ProgramModel> = {};

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.programRepo.findAll(findOptions);

    return ans.map((program) => program.get({ plain: true }));
  }

  async createPrograms(programs: CreateProgramsDto[]) {
    const ans = await this.programRepo.bulkCreate(programs);

    return ans.map((program) => program.id);
  }

  async updateProgram(program: UpdateProgramsDto) {
    const [ans] = await this.programRepo.update(program, { where: { id: program.id } });

    return ans > 0 ? [] : [program.id];
  }

  async deletePrograms(ids: string | string[]) {
    const ans = await this.programRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
