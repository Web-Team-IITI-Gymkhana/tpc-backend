import { Inject, Injectable, Logger } from "@nestjs/common";
import { omit } from "lodash";
import { Transaction, WhereOptions } from "sequelize";
import { FACULTY_DAO } from "src/constants";
import { FacultyModel, UserModel } from "src/db/models";
import { Faculty } from "src/entities/Faculty";
import { getQueryValues } from "src/utils/utils";

@Injectable()
class FacultyService {
  private logger = new Logger(FacultyService.name);

  constructor(@Inject(FACULTY_DAO) private facultyRepo: typeof FacultyModel) {}

  async getFaculties(whereFaculty?: WhereOptions<FacultyModel>, whereUser?: WhereOptions<UserModel>,t?: Transaction) {
    const valuesFaculty = getQueryValues(whereFaculty);
    const valuesUser = getQueryValues(whereUser);
    const facultyModels = await this.facultyRepo.findAll({ where: valuesFaculty, transaction: t, include: {model: UserModel, where: valuesUser, required: true} });
    return facultyModels.map((facultyModel) => Faculty.fromModel(facultyModel));
  }

  async getOrCreateFaculty(faculty: Faculty, t?: Transaction) {
    const [facultyModel] = await this.facultyRepo.findOrCreate({
      where: omit(faculty, "user"),
      defaults: omit(faculty, "user"),
      transaction: t,
    });
    return Faculty.fromModel(facultyModel);
  }

  async deleteFaculty(facultyId: string, t?: Transaction) {
    return !!(await this.facultyRepo.destroy({ where: { id: facultyId }, transaction: t }));
  }

  async updateFaculty(facultyId: string, fieldsToUpdate: object, t?: Transaction) {
    const [_, updatedModel] = await this.facultyRepo.update(fieldsToUpdate, {
      where: { id: facultyId },
      returning: true,
      transaction: t,
    });
    return Faculty.fromModel(updatedModel[0]);
  }
}

export default FacultyService;
