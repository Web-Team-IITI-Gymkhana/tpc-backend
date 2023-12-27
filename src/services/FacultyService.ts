import { Inject, Injectable, Logger } from "@nestjs/common";
import { omit } from "lodash";
import { Transaction } from "sequelize";
import { FACULTY_DAO } from "src/constants";
import { FacultyModel } from "src/db/models";
import { Faculty } from "src/entities/Faculty";

@Injectable()
class FacultyService {
  private logger = new Logger(FacultyService.name);

  constructor(@Inject(FACULTY_DAO) private facultyRepo: typeof FacultyModel) {}

  async createFaculty(faculty: Faculty, t?: Transaction) {
    const facultyModel = await this.facultyRepo.create(omit(faculty, "user"), { transaction: t });
    return Faculty.fromModel(facultyModel);
  }

  async deleteFaculty(facultyId: string, t?: Transaction) {
    await this.facultyRepo.destroy({ where: { id: facultyId }, transaction: t });
  }
}

export default FacultyService;
