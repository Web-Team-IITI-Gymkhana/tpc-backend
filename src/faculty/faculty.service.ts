import { fa } from "@faker-js/faker";
import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import sequelize from "sequelize";
import { FACULTY_DAO, USER_DAO } from "src/constants";
import {
  CompanyModel,
  FacultyApprovalRequestModel,
  FacultyModel,
  JobModel,
  SalaryModel,
  SeasonModel,
  UserModel,
} from "src/db/models";
import { RoleEnum } from "src/enums";

@Injectable()
export class FacultyService {
  constructor(
    @Inject(FACULTY_DAO) private facultyRepo: typeof FacultyModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel
  ) {}

  async getFaculties() {
    const ans = await this.facultyRepo.findAll({ include: [{ model: UserModel, as: "user" }] });

    return ans.map((faculty) => faculty.get({ plain: true }));
  }

  async getFaculty(id: string) {
    const ans = await this.facultyRepo.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "user",
        },
        {
          model: FacultyApprovalRequestModel,
          as: "facultyApprovalRequests",
          include: [
            {
              model: SalaryModel,
              as: "salary",
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
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!ans) throw new NotFoundException(`Faculty with id: ${id} not found`);

    return ans.get({ plain: true });
  }

  async createFaculties(body) {
    const faculties = body.map((faculty) => {
      faculty.user.role = RoleEnum.FACULTY;

      return faculty;
    });
    const ans = await this.facultyRepo.bulkCreate(faculties, {
      include: [{ model: UserModel, as: "user" }],
    });

    return ans.map((faculty) => faculty.id);
  }

  async deleteFaculties(ids: string[]) {
    const res = await this.userRepo.destroy({
      where: sequelize.literal(
        `"id" IN (SELECT "userId" FROM "Faculty" WHERE id in (${ids.map((id) => `'${id}'`).join(",")}))`
      ),
    });

    return res;
  }
}
