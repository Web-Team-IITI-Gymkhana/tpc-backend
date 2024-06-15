import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import {
  FacultyApprovalRequestModel,
  FacultyModel,
  JobModel,
  SalaryModel,
  UserModel,
  CompanyModel,
  SeasonModel,
} from "src/db/models";
import { FACULTY_DAO, FACULTY_APPROVAL_REQUEST_DAO, USER_DAO } from "src/constants";
import sequelize, { WhereOptions, Transaction } from "sequelize";
import { FacultyApprovalStatusEnum } from "src/enums";
import { UpdateFacultyApprovalStatusDto, UpdateFacultyDto } from "./dto/patch.dto";
import { omit } from "lodash";

@Injectable()
export class FacultyViewService {
  constructor(
    @Inject(FACULTY_DAO) private facultyRepo: typeof FacultyModel,
    @Inject(FACULTY_APPROVAL_REQUEST_DAO) private facultyapprovalrequestRepo: typeof FacultyApprovalRequestModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel
  ) {}

  async getFaculty(facultyId: string) {
    const ans = await this.facultyRepo.findByPk(facultyId, {
      include: {
        model: UserModel,
        as: "user",
        required: true,
      },
    });
    if (!ans) throw new UnauthorizedException(`Faculty with id ${facultyId} not found`);

    return ans.get({ plain: true });
  }

  async getApprovals(facultyId: string) {
    const ans = await this.facultyapprovalrequestRepo.findAll({
      where: {
        facultyId: facultyId,
      },
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
    });

    if (!ans) throw new UnauthorizedException(`Unauthorized`);

    return ans.map((approval) => approval.get({ plain: true }));
  }

  async getEnums() {
    return { FacultyApprovalStatus: Object.values(FacultyApprovalStatusEnum) };
  }

  async updateApprovalStatus(approval: UpdateFacultyApprovalStatusDto, facultyId: string) {
    const [ans] = await this.facultyapprovalrequestRepo.update(approval, {
      where: { id: approval.id, facultyId: facultyId },
    });
    if (ans == 0) throw new UnauthorizedException(`Unauthorized`);

    return ans > 0 ? [] : [approval.id];
  }

  async updateFaculty(faculty: UpdateFacultyDto, t: Transaction, facultyId: string) {
    const [facultyUpdateResult, userUpdateResult] = await Promise.all([
      this.facultyRepo.update(omit(faculty, "user"), {
        where: { id: facultyId },
        transaction: t,
      }),
      this.userRepo.update(faculty.user || {}, {
        where: sequelize.literal(`"id" IN (SELECT "userId" FROM "Faculty" WHERE "id" = '${facultyId}')`),
        transaction: t,
      }),
    ]);

    const [facultyUpdateCount] = facultyUpdateResult;
    const [userUpdateCount] = userUpdateResult;

    return facultyUpdateCount > 0 || userUpdateCount > 0 ? [] : [facultyId];
  }
}
