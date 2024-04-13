import { Injectable, Inject } from "@nestjs/common";
import sequelize from "sequelize";
import { FindOptions, Transaction } from "sequelize";
import { FACULTY_APPROVAL_REQUEST_DAO, FACULTY_DAO, SALARY_DAO } from "src/constants";
import {
  CompanyModel,
  FacultyApprovalRequestModel,
  FacultyModel,
  JobModel,
  SalaryModel,
  SeasonModel,
  UserModel,
} from "src/db/models";
import { CriteriaDto } from "src/salary/dtos/get.dto";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";

@Injectable()
export class FacultyApprovalService {
  constructor(
    @Inject(FACULTY_APPROVAL_REQUEST_DAO) private facultyApprovalRepo: typeof FacultyApprovalRequestModel,
    @Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel,
    @Inject(FACULTY_DAO) private facultyRepo: typeof FacultyModel
  ) {}

  async getFacultyApprovalRequests(where) {
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

    const ans = await this.facultyApprovalRepo.findAll(findOptions);

    return ans.map((req) => req.get({ plain: true }));
  }

  async createFacultyApprovalRequests(salaryId, facReqs, t: Transaction) {
    const [ans, salary, faculties] = await Promise.all([
      this.facultyApprovalRepo.bulkCreate(facReqs, { transaction: t }),
      this.salaryRepo.findByPk(salaryId),
      this.facultyRepo.findAll({ where: { id: facReqs.map((req) => req.facultyId) } }),
    ]);

    const depts = faculties.map((faculty) => faculty.department);
    const criteria: CriteriaDto = salary.criteria;
    const approvals = criteria.facultyApprovals || [];
    approvals.push(...depts);
    criteria.facultyApprovals = approvals;

    await this.salaryRepo.update({ criteria: criteria }, { where: { id: salary.id }, transaction: t });

    return ans.map((req) => req.id);
  }

  async deleteFacultyApprovalRequest(id: string, t: Transaction) {
    const [facReq, salary] = await Promise.all([
      this.facultyApprovalRepo.findByPk(id, { include: [{ model: FacultyModel, as: "faculty" }] }),
      this.salaryRepo.findOne({
        where: sequelize.literal(`"id" IN (SELECT "salaryId" FROM "FacultyApprovalRequest" where "id" = '${id}')`),
      }),
    ]);

    const department = facReq.faculty.department;
    const criteria: CriteriaDto = salary.criteria;
    const approvals = criteria.facultyApprovals;
    criteria.facultyApprovals = approvals.filter((dept) => dept !== department);

    const [_, ans] = await Promise.all([
      this.salaryRepo.update({ criteria: criteria }, { where: { id: salary.id } }),
      this.facultyApprovalRepo.destroy({ where: { id: id } }),
    ]);

    return ans;
  }
}
