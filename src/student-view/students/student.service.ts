import { Inject, Injectable } from "@nestjs/common";
import { Transaction, WhereOptions } from "sequelize";
import { REGISTRATIONS_DAO, RESUME_DAO, STUDENT_DAO } from "src/constants";
import { PenaltyModel, ProgramModel, ResumeModel, SeasonModel, StudentModel, UserModel } from "src/db/models";
import { RegistrationModel } from "src/db/models/RegistrationModel";

@Injectable()
export class StudentService {
  constructor(
    @Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
    @Inject(RESUME_DAO) private resumeRepo: typeof ResumeModel,
    @Inject(REGISTRATIONS_DAO) private registrationsRepo: typeof RegistrationModel
  ) {}

  async getStudent(id: string) {
    const ans = await this.studentRepo.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "user",
        },
        {
          model: ProgramModel,
          as: "program",
        },
        {
          model: PenaltyModel,
          as: "penalties",
        },
        {
          model: RegistrationModel,
          as: "registrations",
          include: [
            {
              model: SeasonModel,
              as: "season",
            },
          ],
        },
      ],
    });

    return ans.get({ plain: true });
  }

  async addResume(filepath: string, id: string, t: Transaction) {
    const ans = await this.resumeRepo.create({ filepath: filepath, studentId: id }, { transaction: t });

    return ans.id;
  }

  async getResumes(where: WhereOptions<ResumeModel>) {
    const ans = await this.resumeRepo.findAll({ where: where });

    return ans.map((resume) => resume.get({ plain: true }));
  }

  async deleteResumes(filepaths: string[], id: string, t: Transaction) {
    const ans = await this.resumeRepo.destroy({ where: { filepath: filepaths, studentId: id }, transaction: t });

    return ans;
  }

  async register(id: string, seasonId: string) {
    const [ans] = await this.registrationsRepo.update(
      { registered: true },
      {
        where: { studentId: id, seasonId: seasonId },
      }
    );

    return ans;
  }
}
