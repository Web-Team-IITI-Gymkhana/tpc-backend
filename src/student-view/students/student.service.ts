import { ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { FindOptions, Op, Transaction, WhereOptions } from "sequelize";
import { JOB_DAO, REGISTRATIONS_DAO, RESUME_DAO, SALARY_DAO, STUDENT_DAO } from "src/constants";
import {
  ApplicationModel,
  CompanyModel,
  EventModel,
  JobCoordinatorModel,
  JobModel,
  PenaltyModel,
  ProgramModel,
  RecruiterModel,
  RegistrationModel,
  ResumeModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  TpcMemberModel,
  UserModel,
} from "src/db/models";
import { CategoryEnum, DepartmentEnum, GenderEnum } from "src/enums";
import { JobsQueryDto } from "src/job/dtos/query.dto";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";

@Injectable()
export class StudentService {
  constructor(
    @Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
    @Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel,
    @Inject(RESUME_DAO) private resumeRepo: typeof ResumeModel,
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(REGISTRATIONS_DAO) private registrationsRepo: typeof RegistrationModel
  ) {}

  async filterSalaries(studentId: string) {
    const student = await this.studentRepo.findByPk(studentId, { include: [ProgramModel] });
    if (!student) throw new ForbiddenException(`Student with id ${studentId} not found`);
    const department: DepartmentEnum = student.program.department;

    const where: WhereOptions<SalaryModel> = {
      programs: { [Op.or]: { [Op.contains]: [student.programId], [Op.is]: null } },
      genders: { [Op.or]: { [Op.contains]: [student.gender as GenderEnum], [Op.is]: null } },
      categories: { [Op.or]: { [Op.contains]: [student.category as CategoryEnum], [Op.is]: null } },
      minCPI: { [Op.lte]: student.cpi },
      tenthMarks: { [Op.lte]: student.tenthMarks },
      twelthMarks: { [Op.lte]: student.twelthMarks },
      [Op.not]: { facultyApprovals: { [Op.contains]: [department] } },
    };

    return where;
  }

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

  async getJobs(studentId: string, where: JobsQueryDto) {
    const whereSalary = await this.filterSalaries(studentId);
    const findOptions: FindOptions<JobModel> = {
      include: [
        {
          model: SeasonModel,
          as: "season",
        },
        {
          model: CompanyModel,
          as: "company",
        },
        {
          model: SalaryModel,
          as: "salaries",
          where: whereSalary,
          required: true,
        },
        {
          model: RecruiterModel,
          as: "recruiter",
          required: true,
          include: [
            {
              model: UserModel,
              as: "user",
            },
          ],
        },
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.jobRepo.findAll(findOptions);

    return ans.map((job) => job.get({ plain: true }));
  }

  async getJob(studentId: string, jobId: string) {
    const whereSalary = await this.filterSalaries(studentId);
    const ans = await this.jobRepo.findByPk(jobId, {
      include: [
        {
          model: SeasonModel,
          as: "season",
        },
        {
          model: CompanyModel,
          as: "company",
        },
        {
          model: RecruiterModel,
          as: "recruiter",
          include: [
            {
              model: UserModel,
              as: "user",
            },
          ],
        },
        {
          model: JobCoordinatorModel,
          as: "jobCoordinators",
          include: [
            {
              model: TpcMemberModel,
              as: "tpcMember",
              include: [
                {
                  model: UserModel,
                  as: "user",
                },
              ],
            },
          ],
        },
        {
          model: EventModel,
          as: "events",
        },
        {
          model: SalaryModel,
          as: "salaries",
          where: whereSalary,
          required: true,
        },
      ],
    });

    if (!ans) throw new UnauthorizedException("You are not authorized to access this job");

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
