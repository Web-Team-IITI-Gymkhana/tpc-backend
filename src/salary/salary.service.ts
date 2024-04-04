import { Inject, Injectable } from "@nestjs/common";
import { SALARY_DAO } from "src/constants";
import { SalaryModel } from "src/db/models";

@Injectable()
export class SalaryService {
  constructor(@Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel) {}

  async getSalaries(where) {
    return where;
  }

  async getSalary(id) {
    return id;
  }

  async createSalaries(salaries) {
    return salaries;
  }

  async updateSalary(salary) {
    return salary;
  }

  async deleteSalaries(ids) {
    return ids;
  }
}
