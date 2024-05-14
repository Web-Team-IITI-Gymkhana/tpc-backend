import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { SALARY_DAO } from "src/constants";
import {
  CompanyModel,
  FacultyApprovalRequestModel,
  FacultyModel,
  JobModel,
  OnCampusOfferModel,
  ProgramModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  UserModel,
} from "src/db/models";
import { SalariesQueryDto } from "./dtos/query.dto";
import { FindOptions } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateSalariesDto } from "./dtos/post.dto";
import { UpdateSalariesDto } from "./dtos/patch.dto";

@Injectable()
export class SalaryService {
  constructor(@Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel) {}

  async getSalaries(where: SalariesQueryDto) {
    const findOptions: FindOptions<SalaryModel> = {
      include: [
        {
          model: JobModel,
          as: "job",
          required: true,
          include: [
            {
              model: CompanyModel,
              as: "company",
            },
            {
              model: SeasonModel,
              as: "season",
            },
          ],
        },
      ],
    };

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
          model: JobModel,
          as: "job",
          required: true,
          include: [
            {
              model: CompanyModel,
              as: "company",
            },
            {
              model: SeasonModel,
              as: "season",
            },
          ],
        },
        {
          model: FacultyApprovalRequestModel,
          as: "facultyApprovalRequests",
          include: [
            {
              model: FacultyModel,
              as: "faculty",
              include: [
                {
                  model: UserModel,
                  as: "user",
                },
              ],
            },
          ],
        },
        {
          model: OnCampusOfferModel,
          as: "onCampusOffers",
          include: [
            {
              model: StudentModel,
              as: "student",
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
        },
      ],
    });

    if (!ans) throw new NotFoundException(`The Salary with id: ${id} does not exist`);

    return ans.get({ plain: true });
  }

  async createSalaries(salaries: CreateSalariesDto[]) {
    const ans = await this.salaryRepo.bulkCreate(salaries);

    return ans.map((salary) => salary.id);
  }

  async updateSalary(salary: UpdateSalariesDto) {
    const [ans] = await this.salaryRepo.update(salary, { where: { id: salary.id } });

    return ans > 0 ? [] : [salary.id];
  }

  async deleteSalaries(ids: string | string[]) {
    const ans = await this.salaryRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
