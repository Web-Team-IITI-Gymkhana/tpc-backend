import { ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import sequelize from "sequelize";
import { FindOptions, Op, Transaction, WhereOptions } from "sequelize";
import { JOB_DAO, REGISTRATIONS_DAO, RESUME_DAO, SALARY_DAO, SEASON_DAO, STUDENT_DAO } from "src/constants";
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
import { JobRegistrationEnum } from "src/enums/jobRegistration.enum";
import { SeasonStatusEnum } from "src/enums/SeasonStatus.enum";
import { JobsQueryDto } from "src/job/dtos/query.dto";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";

@Injectable()
export class StudentService {
  constructor(
    @Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
    @Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel,
    @Inject(RESUME_DAO) private resumeRepo: typeof ResumeModel,
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(SEASON_DAO) private seasonRepo: typeof SeasonModel,
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
              required: true,
              where: {
                status: SeasonStatusEnum.ACTIVE,
              },
            },
          ],
        },
      ],
    });

    if (!ans) throw new UnauthorizedException(`Student with id ${studentId} not found`);

    return ans.get({ plain: true });
  }

  async getOpportunities(studentId: string, where: JobsQueryDto) {
    const whereSalary = await this.filterSalaries(studentId);
    const findOptions: FindOptions<JobModel> = {
      where: {
        active: true,
        registration: JobRegistrationEnum.OPEN,
        id: {
          [Op.notIn]: sequelize.literal(`(SELECT "jobId" FROM "Application" WHERE "studentId" = '${studentId}')`),
        },
      },
      include: [
        {
          model: SeasonModel,
          as: "season",
          required: true,
          include: [
            {
              model: RegistrationModel,
              as: "registrations",
              where: { registered: true, studentId: studentId },
            },
          ],
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

  async getJobs(studentId: string, where: JobsQueryDto) {
    const whereSalary = await this.filterSalaries(studentId);
    const findOptions: FindOptions<JobModel> = {
      where: {
        active: true,
        registration: JobRegistrationEnum.OPEN,
        id: {
          [Op.in]: sequelize.literal(`(SELECT "jobId" FROM "Application" WHERE "studentId" = '${studentId}')`),
        },
      },
      include: [
        {
          model: SeasonModel,
          as: "season",
          required: true,
          include: [
            {
              model: RegistrationModel,
              as: "registrations",
              where: { registered: true, studentId: studentId },
            },
          ],
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
    const ans = await this.jobRepo.findOne({
      where: { id: jobId, active: true, registration: JobRegistrationEnum.OPEN },
      include: [
        {
          model: SeasonModel,
          as: "season",
          required: true,
          include: [
            {
              model: RegistrationModel,
              as: "registrations",
              where: { registered: true, studentId: studentId },
            },
          ],
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

  async addResume(studentId: string, filepath: string, name: string, t: Transaction) {
    const ans = await this.resumeRepo.create({ studentId, filepath, name }, { transaction: t });

    return ans.id;
  }

  async deleteResumes(studentId: string, filepath: string | string[], t: Transaction) {
    const ans = await this.resumeRepo.destroy({ where: { studentId, filepath }, transaction: t });

    return ans;
  }

  async registerSeason(studentId: string, seasonId: string) {
    const season = await this.seasonRepo.findOne({ where: { id: seasonId } });

    if (season && season.status === SeasonStatusEnum.ACTIVE) {
      const [ans] = await this.registrationsRepo.update(
        { registered: true },
        { where: { studentId: studentId, seasonId: seasonId } }
      );

      return ans > 0 ? [] : [seasonId];
    } else {
      return [seasonId];
    }
  }

  async deregisterSeason(studentId: string, seasonId: string) {
    const season = await this.seasonRepo.findOne({ where: { id: seasonId } });

    if (season && season.status === SeasonStatusEnum.ACTIVE) {
      const [ans] = await this.registrationsRepo.update(
        { registered: false },
        { where: { studentId: studentId, seasonId: seasonId } }
      );

      return ans > 0 ? [] : [seasonId];
    } else {
      return [seasonId];
    }
  }
}
