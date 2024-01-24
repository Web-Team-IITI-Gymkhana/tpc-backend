import { Inject, Injectable, Logger } from "@nestjs/common";
import { isObject, omit } from "lodash";
import { Transaction, WhereOptions, SaveOptions, Sequelize } from "sequelize";
import { JOB_SERVICE, SALARY_DAO } from "src/constants";
import { SalaryModel } from "src/db/models";
import { Salary } from "src/entities/Salary";
import { getQueryValues } from "src/utils/utils";

@Injectable()
class SalaryService {
  private logger = new Logger(SalaryService.name);

  constructor(@Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel) {}

  async createSalary(salary: Salary, t?: Transaction) {
    const values = getQueryValues(salary);
    const salaryModel = await this.salaryRepo.create(omit(values,"categories","programs","genders"), {transaction: t});
    if(values['categories'])      await salaryModel.$add('categories', values['categories']);
    if(values['programs'])        await salaryModel.$add('programs', values['programs']);
    if(values['genders'])         await salaryModel.$add('genders', values['genders']);
    await salaryModel.save();
    return Salary.fromModel(salaryModel);
  }

  async getSalaries(where: WhereOptions<SalaryModel>, t?: Transaction) {
    const salaryModels = await this.salaryRepo.findAll({ where: where, transaction: t });
    return salaryModels.map((salaryModel) => Salary.fromModel(salaryModel));
  }

  async updateSalary(salaryId: string, fieldsToUpdate: object, t?: Transaction) {
    const [_, salary] = await this.salaryRepo.update(fieldsToUpdate, {
      where: { id: salaryId },
      transaction: t,
      returning: true,
    });
    return Salary.fromModel(salary[0]);

    //Update a JSON without simply overwriting it.
    //Move to utils/ make a middleware/interceptor.
    // function flattenObject(obj, parentKey = '') {
    //   let result = {};
    
    //   for (let key in obj) {
    //     if (obj.hasOwnProperty(key)) {
    //       let newKey = parentKey ? `${parentKey}.${key}` : key;
    
    //       if (typeof obj[key] === 'object' && obj[key] !== null) {
    //         // Recursively flatten nested objects
    //         Object.assign(result, flattenObject(obj[key], newKey));
    //       } else {
    //         result[newKey] = obj[key];
    //       }
    //     }
    //     return result;
    //   }
    // }
  //   for(const key in fieldsToUpdate) {
  //     if(isObject(fieldsToUpdate[key])) {
  //       const result = flattenObject(fieldsToUpdate[key], key);
  //       delete fieldsToUpdate[key];
  //       fieldsToUpdate = Object.assign(result);
  //     }
  // }
    
    // const salaries = await this.salaryRepo.findAll({where: {id: salaryId}});  Done already in controller.
    // const salary = salaries[0];
    // salary.set(fieldsToUpdate);
    // await salary.save();
    // return salary;
  }

  async deleteSalary(salaryId: string, t?: Transaction) {
    return !!(await this.salaryRepo.destroy({ where: { id: salaryId }, transaction: t }));
  }
}

export default SalaryService;
