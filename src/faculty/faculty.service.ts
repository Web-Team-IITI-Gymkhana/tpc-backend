import { fa } from "@faker-js/faker";
import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import sequelize, { FindOptions, Transaction } from "sequelize";
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
import { RoleEnum, DepartmentEnum } from "src/enums";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { FacultyQueryDto } from "./dtos/query.dto";
import { CreateFacultiesDto } from "./dtos/post.dto";
import { omit } from "lodash";
import { UpdateFacultiesDto } from "./dtos/patch.dto";

// Interface for faculty creation with nested user that matches Sequelize bulk creation expectations
interface FacultyCreationData {
  department: DepartmentEnum;
  user: {
    name: string;
    email: string;
    contact: string;
    role: RoleEnum;
  };
}

@Injectable()
export class FacultyService {
  constructor(
    @Inject(FACULTY_DAO) private facultyRepo: typeof FacultyModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel
  ) {}

  async getFaculties(where: FacultyQueryDto) {
    const findOptions: FindOptions<FacultyModel> = {
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.facultyRepo.findAll(findOptions);

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

  async createFaculties(body: CreateFacultiesDto[]) {
    const faculties: FacultyCreationData[] = body.map((faculty) => ({
      department: faculty.department,
      user: {
        name: faculty.user.name,
        email: faculty.user.email,
        contact: faculty.user.contact,
        role: RoleEnum.FACULTY,
      },
    }));

    const ans = await this.facultyRepo.bulkCreate(faculties as any[], {
      include: [{ model: UserModel, as: "user" }],
    });

    return ans.map((faculty) => faculty.id);
  }

  async updateFaculty(faculty: UpdateFacultiesDto, t: Transaction) {
    const [[ans], [res]] = await Promise.all([
      this.facultyRepo.update(omit(faculty, "user"), { where: { id: faculty.id }, transaction: t }),
      this.userRepo.update(faculty.user || {}, {
        where: sequelize.literal(`"id" IN (SELECT "userId" FROM "Faculty" WHERE "id" = '${faculty.id}')`),
        transaction: t,
      }),
    ]);

    return ans > 0 || res > 0 ? [] : [faculty.id];
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
