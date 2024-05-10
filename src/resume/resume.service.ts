import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { RESUME_DAO } from "src/constants";
import {
  ApplicationModel,
  CompanyModel,
  EventModel,
  JobModel,
  ProgramModel,
  ResumeModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  UserModel,
} from "src/db/models";
import { ResumeQueryDto } from "./dtos/query.dto";
import { FindOptions, Transaction } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateResumeDto } from "./dtos/post.dto";
import { UpdateResumesDto } from "./dtos/patch.dto";

@Injectable()
export class ResumeService {
  constructor(@Inject(RESUME_DAO) private resumeRepo: typeof ResumeModel) {}

  async getResumes(where: ResumeQueryDto) {
    const findOptions: FindOptions<ResumeModel> = {
      include: [
        {
          model: StudentModel,
          as: "student",
          required: true,
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
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.resumeRepo.findAll(findOptions);

    return ans.map((resume) => resume.get({ plain: true }));
  }

  async getResume(id: string) {
    const ans = await this.resumeRepo.findByPk(id, {
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
        {
          model: ApplicationModel,
          as: "applications",
          include: [
            {
              model: JobModel,
              as: "job",
              include: [
                {
                  model: CompanyModel,
                  as: "company",
                },
                {
                  model: SeasonModel,
                  as: "season",
                },
                {
                  model: SalaryModel,
                  as: "salaries",
                },
              ],
            },
            {
              model: EventModel,
              as: "event",
            },
          ],
        },
      ],
    });

    if (!ans) throw new NotFoundException(`Resume with id ${id} not found`);

    return ans.get({ plain: true });
  }

  async createResume(resume: CreateResumeDto, t: Transaction) {
    const ans = await this.resumeRepo.create(resume, { transaction: t });

    return ans.id;
  }

  async updateResume(resume: UpdateResumesDto) {
    const [ans] = await this.resumeRepo.update(resume, { where: { id: resume.id } });

    return ans > 0 ? [] : [resume.id];
  }

  async deleteResumes(filepaths: string | string[], t: Transaction) {
    const ans = await this.resumeRepo.destroy({ where: { filepath: filepaths }, transaction: t });

    return ans;
  }
}
