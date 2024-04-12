import { Injectable, Inject } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { RESUME_DAO } from "src/constants";
import { ProgramModel, ResumeModel, StudentModel, UserModel } from "src/db/models";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";

@Injectable()
export class ResumeService {
  constructor(@Inject(RESUME_DAO) private resumeRepo: typeof ResumeModel) {}

  async getResumes(where) {
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

  async updateResume(resume) {
    const [ans] = await this.resumeRepo.update({ verified: resume.verified }, { where: { id: resume.id } });

    return ans > 0 ? [] : [resume.id];
  }
}
