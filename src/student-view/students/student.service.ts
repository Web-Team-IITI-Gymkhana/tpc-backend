import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Transaction, WhereOptions } from "sequelize";
import { REGISTRATIONS_DAO, RESUME_DAO, STUDENT_DAO } from "src/constants";
import {
  PenaltyModel,
  ProgramModel,
  RegistrationModel,
  ResumeModel,
  SeasonModel,
  StudentModel,
  UserModel,
} from "src/db/models";

@Injectable()
export class StudentService {
  constructor(
    @Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
    @Inject(RESUME_DAO) private resumeRepo: typeof ResumeModel,
    @Inject(REGISTRATIONS_DAO) private registrationsRepo: typeof RegistrationModel
  ) {}

  async getStudent(studentId: string) {
    const ans = await this.studentRepo.findByPk(studentId, {
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

    if (!ans) throw new UnauthorizedException(`Student with id ${studentId} not found`);

    return ans.get({ plain: true });
  }

  async getResumes(where: WhereOptions<ResumeModel>) {
    const ans = await this.resumeRepo.findAll({ where });

    return ans.map((resume) => resume.get({ plain: true }));
  }

  async addResume(studentId: string, filepath: string, t: Transaction) {
    const ans = await this.resumeRepo.create({ studentId, filepath }, { transaction: t });

    return ans.id;
  }

  async deleteResumes(studentId: string, filepath: string | string[], t: Transaction) {
    const ans = await this.resumeRepo.destroy({ where: { studentId, filepath }, transaction: t });

    return ans;
  }

  async registerSeason(studentId: string, seasonId: string) {
    const [ans] = await this.registrationsRepo.update({ registered: true }, { where: { studentId, seasonId } });

    return ans > 0 ? [] : [seasonId];
  }
}
