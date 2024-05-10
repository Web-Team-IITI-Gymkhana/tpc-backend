import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FACULTY_APPROVAL_REQUEST_DAO, FACULTY_DAO, SALARY_DAO, SEQUELIZE_DAO } from "src/constants";
import {
  CompanyModel,
  FacultyApprovalRequestModel,
  FacultyModel,
  JobModel,
  SalaryModel,
  SeasonModel,
  UserModel,
} from "src/db/models";
import { FacultyApprovalsQueryDto } from "./dtos/query.dto";
import { FindOptions, Sequelize, Transaction } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateFacultyApprovalsDto } from "./dtos/post.dto";
import sequelize from "sequelize";
import { UpdateFacultyApprovalsDto } from "./dtos/patch.dto";
import { FacultyApprovalStatusEnum } from "src/enums";

@Injectable()
export class FacultyApprovalService {
  constructor(
    @Inject(FACULTY_APPROVAL_REQUEST_DAO) private facultyApprovalsRepo: typeof FacultyApprovalRequestModel,
    @Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel,
    @Inject(FACULTY_DAO) private facultyRepo: typeof FacultyModel,
    @Inject(SEQUELIZE_DAO) private sequelizeInstance: Sequelize
  ) {}

  async getFacultyApprovals(where: FacultyApprovalsQueryDto) {
    const findOptions: FindOptions<FacultyApprovalRequestModel> = {
      include: [
        {
          model: FacultyModel,
          as: "faculty",
          required: true,
          include: [
            {
              model: UserModel,
              as: "user",
            },
          ],
        },
        {
          model: SalaryModel,
          as: "salary",
          required: true,
          include: [
            {
              model: JobModel,
              as: "job",
              required: true,
              include: [
                {
                  model: SeasonModel,
                  as: "season",
                },
                {
                  model: CompanyModel,
                  as: "company",
                },
              ],
            },
          ],
        },
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.facultyApprovalsRepo.findAll(findOptions);

    return ans.map((facultyApproval) => facultyApproval.get({ plain: true }));
  }

  async createFacultyApprovals(salaryId: string, facultyApprovals: CreateFacultyApprovalsDto[], t: Transaction) {
    const [ans, _] = await Promise.all([
      this.facultyApprovalsRepo.bulkCreate(
        facultyApprovals.map((facultyApproval) => ({ ...facultyApproval, salaryId })),
        { transaction: t }
      ),
      this.salaryRepo.update(
        {
          facultyApprovals: sequelize.literal(
            `array_cat("facultyApprovals"::text[], 
            (SELECT ARRAY
              ( SELECT "department" FROM "Faculty" WHERE "id" IN 
              (${facultyApprovals.map((approval) => `'${approval.facultyId}'`).join(",")})
              )
            )::text[])::"enum_Salary_facultyApprovals"[]`
          ),
        },
        { where: { id: salaryId }, transaction: t }
      ),
    ]);

    return ans.map((approval) => approval.id);
  }

  async updateFacultyApproval(facultyApproval: UpdateFacultyApprovalsDto, t: Transaction) {
    const pr = [];
    pr.push(this.facultyApprovalsRepo.update(facultyApproval, { where: { id: facultyApproval.id }, transaction: t }));

    if (facultyApproval.status) {
      if (facultyApproval.status === FacultyApprovalStatusEnum.APPROVED)
        pr.push(this.removeFacultyApproval(facultyApproval.id, t));
      else pr.push(this.addFacultyApproval(facultyApproval.id, t));
    }
    const [[ans]] = await Promise.all(pr);

    return ans > 0 ? [] : [facultyApproval.id];
  }

  async deleteFacultyApproval(facultyApprovalId: string, t: Transaction) {
    const [_, res] = await Promise.all([
      this.removeFacultyApproval(facultyApprovalId, t),
      this.facultyApprovalsRepo.destroy({ where: { id: facultyApprovalId }, transaction: t }),
    ]);

    return res;
  }

  async removeFacultyApproval(facultyApprovalId: string, t: Transaction) {
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

  async addFacultyApproval(facultyApprovalId: string, t: Transaction) {
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
}
