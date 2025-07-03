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
import { FACULTY_DAO, FACULTY_APPROVAL_REQUEST_DAO, USER_DAO, SEQUELIZE_DAO } from "src/constants";
import sequelize, { WhereOptions, Transaction, Sequelize } from "sequelize";
import { FacultyApprovalStatusEnum } from "src/enums";
import { UpdateFacultyApprovalStatusDto, UpdateFacultyDto } from "./dto/patch.dto";
import { omit } from "lodash";

@Injectable()
export class FacultyViewService {
  constructor(
    @Inject(FACULTY_DAO) private facultyRepo: typeof FacultyModel,
    @Inject(FACULTY_APPROVAL_REQUEST_DAO) private facultyapprovalrequestRepo: typeof FacultyApprovalRequestModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel,
    @Inject(SEQUELIZE_DAO) private sequelizeInstance: Sequelize
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
    return await this.sequelizeInstance.transaction(async (t) => {
      // First verify the faculty approval request belongs to this faculty
      const facultyApprovalRequest = await this.facultyapprovalrequestRepo.findOne({
        where: { id: approval.id, facultyId: facultyId },
        transaction: t,
      });

      if (!facultyApprovalRequest) {
        throw new UnauthorizedException(`Unauthorized`);
      }

      // Update the faculty approval request status and remarks
      const [updateCount] = await this.facultyapprovalrequestRepo.update(approval, {
        where: { id: approval.id, facultyId: facultyId },
        transaction: t,
      });

      if (updateCount === 0) {
        throw new UnauthorizedException(`Unauthorized`);
      }

      // Update the salary's facultyApprovals array based on the approval status
      if (approval.status === FacultyApprovalStatusEnum.APPROVED) {
        // Remove the faculty's department from the facultyApprovals array
        await this.removeFacultyApproval(approval.id, t);
      } else {
        // Add the faculty's department to the facultyApprovals array (for REJECTED or PENDING)
        await this.addFacultyApproval(approval.id, t);
      }

      return updateCount > 0 ? [] : [approval.id];
    });
  }

  private async removeFacultyApproval(facultyApprovalId: string, t: Transaction) {
    await this.sequelizeInstance.query(
      `UPDATE
        "Salary"
    SET
        "facultyApprovals" = array_remove(
            "facultyApprovals" :: text [],
            (
                SELECT
                    "department" :: text
                FROM
                    "Faculty"
                WHERE
                    "id" IN (
                        SELECT
                            "facultyId"
                        FROM
                            "FacultyApprovalRequest"
                        WHERE
                            id = '${facultyApprovalId}'
                    )
                LIMIT
                    1 OFFSET 0
            )
        ) :: "enum_Salary_facultyApprovals" [], "updatedAt" = '${new Date().toISOString()}'
    WHERE
        "id" IN (
            SELECT
                "salaryId"
            FROM
                "FacultyApprovalRequest"
            WHERE
                "id" = '${facultyApprovalId}'
        )`,
      { type: sequelize.QueryTypes.UPDATE, transaction: t }
    );
  }

  private async addFacultyApproval(facultyApprovalId: string, t: Transaction) {
    await this.sequelizeInstance.query(
      `UPDATE
      "Salary"
  SET
      "facultyApprovals" = ARRAY(
          SELECT
              DISTINCT unnest(
                  array_cat(
                      "facultyApprovals" :: text [],
                      (
                          SELECT
                              ARRAY (
                                  SELECT
                                      "department"
                                  FROM
                                      "Faculty"
                                  WHERE
                                      "id" IN (
                                          SELECT
                                              "facultyId"
                                          FROM
                                              "FacultyApprovalRequest"
                                          WHERE
                                              "id" = '${facultyApprovalId}'
                                      )
                              )
                      ) :: text []
                  ) :: "enum_Salary_facultyApprovals" []
              ) AS "S"
      ), "updatedAt" = '${new Date().toISOString()}'
  WHERE
  "id" IN (
    SELECT
        "salaryId"
    FROM
        "FacultyApprovalRequest"
    WHERE
        "id" = '${facultyApprovalId}'
)`,
      { type: sequelize.QueryTypes.UPDATE, transaction: t }
    );
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
