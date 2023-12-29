import { Inject, Injectable, Logger } from "@nestjs/common";
import { omit } from "lodash";
import { Transaction, WhereOptions } from "sequelize";
import { FACULTY_DAO } from "src/constants";
import { FacultyModel } from "src/db/models";
import { Faculty } from "src/entities/Faculty";

@Injectable()
class FacultyService {
  private logger = new Logger(FacultyService.name);

  constructor(@Inject(FACULTY_DAO) private facultyRepo: typeof FacultyModel) {}

  async getFaculty(where?: WhereOptions<FacultyModel>, t?: Transaction) {
    const facultyModels = await this.facultyRepo.findAll({ where: where, transaction: t });
    return facultyModels.map((facultyModel) => Faculty.fromModel(facultyModel));
  }

  async createFaculty(faculty: Faculty, t?: Transaction) {
    const facultyModel = await this.facultyRepo.create(omit(faculty, "user"), { transaction: t });
    return Faculty.fromModel(facultyModel);
  }

  async deleteFaculty(facultyId: string, t?: Transaction) {
    const faculty = await this.facultyRepo.findAll({ where: { id: facultyId } });
    await this.facultyRepo.destroy({ where: { id: facultyId }, transaction: t });
    return faculty[0].userId;
  }

  async buildQuery(fieldsToUpdate: object) {
    const attr = await this.facultyRepo.describe();
    const attributes = Object.keys(attr);
    const values = {};
    for (const attribute of attributes) {
      if (fieldsToUpdate[`${attribute}`]) {
        values[`${attribute}`] = fieldsToUpdate[`${attribute}`];
      }
    }
    return values;
  }

  async updateFaculty(facultyId: string, fieldsToUpdate: object, t?: Transaction) {
    const values = await this.buildQuery(fieldsToUpdate);
    const [_, updatedModel] = await this.facultyRepo.update(values, {
      where: { id: facultyId },
      returning: true,
      transaction: t,
    });
    return Faculty.fromModel(updatedModel[0]);
  }
}

export default FacultyService;
