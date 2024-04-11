import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { SALARY_DAO } from "src/constants";
import { FacultyApprovalRequestModel, SalaryModel } from "src/db/models";
import { parsePagesize, parseFilter, parseOrder } from "src/utils";

@Injectable()
export class SalaryService {
  constructor(@Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel) {}

  async getSalaries(where) {
    const findOptions: FindOptions<SalaryModel> = {};
    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.salaryRepo.findAll(findOptions);

    return ans.map((salary) => salary.get({ plain: true }));
  }

  async getSalary(id: string) {
    const ans = await this.salaryRepo.findByPk(id, {
      include: [
        {
          model: FacultyApprovalRequestModel,
          as: "facultyApprovalRequests",
        },
      ],
    });

    return ans.get({ plain: true });
  }

  async createSalaries(salaries) {
    const ans = await this.salaryRepo.bulkCreate(salaries);

    return ans.map((salary) => salary.id);
  }

  async updateSalary(salary) {
    const id = salary.id;
    const [res] = await this.salaryRepo.update(salary, { where: { id: id } });

    return res > 0 ? [] : [id];
  }

  async deleteSalaries(ids) {
    const ans = await this.salaryRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
