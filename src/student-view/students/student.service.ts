import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import sequelize, { Sequelize } from "sequelize";
import { FindOptions, Op, Transaction, WhereOptions } from "sequelize";
import {
  EVENT_DAO,
  JOB_DAO,
  MAX_RESUMES_PER_STUDENT,
  ON_CAMPUS_OFFER_DAO,
  REGISTRATIONS_DAO,
  RESUME_DAO,
  SALARY_DAO,
  SEASON_DAO,
  STUDENT_DAO,
} from "src/constants";
import {
  ApplicationModel,
  CompanyModel,
  EventModel,
  JobCoordinatorModel,
  JobModel,
  OnCampusOfferModel,
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
import { FeedbackModel } from "src/db/models/FeedbackModel";
import { CategoryEnum, DepartmentEnum, GenderEnum, BacklogEnum } from "src/enums";
import { JobRegistrationEnum } from "src/enums/jobRegistration.enum";
import { SeasonStatusEnum } from "src/enums/SeasonStatus.enum";
import { EventsQueryDto } from "src/event/dtos/query.dto";
import { JobsQueryDto } from "src/job/dtos/query.dto";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { OnboardingUpdateDto } from "../../student/dtos/patch.dto";

@Injectable()
export class StudentService {
  constructor(
    @Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
    @Inject(EVENT_DAO) private eventRepo: typeof EventModel,
    @Inject(RESUME_DAO) private resumeRepo: typeof ResumeModel,
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(ON_CAMPUS_OFFER_DAO) private offerRepo: typeof OnCampusOfferModel,
    @Inject(SEASON_DAO) private seasonRepo: typeof SeasonModel,
    @Inject(REGISTRATIONS_DAO) private registrationsRepo: typeof RegistrationModel,
    @Inject("SEQUELIZE") private readonly sequelizeInstance: Sequelize
  ) {}

  async filterSalaries(studentId: string) {
    const student = await this.studentRepo.findByPk(studentId, { include: [ProgramModel] });
    if (!student) throw new ForbiddenException(`Student with id ${studentId} not found`);
    const department: DepartmentEnum = student.program.department;

    let backlogFilter: any = {};
    if (student.backlog === BacklogEnum.ACTIVE) {
      backlogFilter = {
        isBacklogAllowed: BacklogEnum.ACTIVE,
      };
    } else if (student.backlog === BacklogEnum.PREVIOUS) {
      backlogFilter = {
        isBacklogAllowed: { [Op.in]: [BacklogEnum.PREVIOUS, BacklogEnum.ACTIVE] },
      };
    } else if (student.backlog === BacklogEnum.NEVER) {
      backlogFilter = {
        isBacklogAllowed: { [Op.in]: [BacklogEnum.NEVER, BacklogEnum.PREVIOUS, BacklogEnum.ACTIVE] },
      };
    }

    const where: WhereOptions<SalaryModel> = {
      programs: { [Op.or]: { [Op.contains]: [student.programId], [Op.is]: null, [Op.eq]: [] } },
      genders: { [Op.or]: { [Op.contains]: [student.gender as GenderEnum], [Op.is]: null, [Op.eq]: [] } },
      categories: { [Op.or]: { [Op.contains]: [student.category as CategoryEnum], [Op.is]: null, [Op.eq]: [] } },
      minCPI: { [Op.lte]: student.cpi },
      tenthMarks: { [Op.lte]: student.tenthMarks },
      twelthMarks: { [Op.lte]: student.twelthMarks },
      [Op.not]: { facultyApprovals: { [Op.contains]: [department] } },
      ...backlogFilter,
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
        {
          model: FeedbackModel,
          as: "feedbacks",
          required: false,
          where: {
            studentId: studentId,
          },
        },
      ],
    });

    // console.log(ans);

    if (!ans) throw new UnauthorizedException("You are not authorized to access this job");

    return ans.get({ plain: true });
  }

  async getStudentEvents(jobId: string, studentId: string) {
    const events = await this.eventRepo.findAll({
      where: {
        jobId: jobId,
      },
      include: [
        {
          model: ApplicationModel,
          as: "applications",
        },
      ],
      order: [["roundNumber", "ASC"]],
    });

    const offers = await this.offerRepo.findAll({
      include: [
        {
          model: SalaryModel,
          as: "salary",
          where: {
            jobId: jobId,
          },
        },
      ],
    });

    let lastEventIndex = -1;
    for (let i = events.length - 1; i >= 0; i--) {
      const event = events[i];
      const hasApplication = event.applications.some((app) => app.studentId === studentId);
      if (hasApplication) {
        lastEventIndex = i;
        break;
      }
    }

    const modifiedEvents = [];
    for (let i = 0; i < events.length; i++) {
      let studentStatus = "CLEARED";

      if (lastEventIndex === -1) {
        studentStatus = "NOT APPLIED";
      } else if (i >= lastEventIndex) {
        if (lastEventIndex < events.length - 1) {
          const nextEvent = events[lastEventIndex + 1];
          studentStatus = nextEvent.applications.length > 0 ? "REJECTED" : "PENDING";
        } else {
          if (offers.length > 0) {
            const hasOffer = offers.some((offer) => offer.studentId === studentId);
            if (hasOffer) {
              studentStatus = "CLEARED";
            } else studentStatus = "REJECTED";
          } else studentStatus = "PENDING";
        }
      }

      modifiedEvents.push({
        ...events[i].get({ plain: true }),
        studentStatus,
      });
    }

    return modifiedEvents;
  }

  async getEvents(where: EventsQueryDto, studentId: string) {
    const whereSalary = await this.filterSalaries(studentId);
    const findOptions: FindOptions<EventModel> = {
      include: [
        {
          model: JobModel,
          as: "job",
          required: true,
          where: {
            active: true,
          },
          include: [
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
          ],
        },
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.eventRepo.findAll(findOptions);

    return ans.map((event) => event.get({ plain: true }));
  }

  async getResumes(where: WhereOptions<ResumeModel>) {
    const ans = await this.resumeRepo.findAll({ where });

    return ans.map((resume) => resume.get({ plain: true }));
  }

  async getJD(filename: string, studentId: string) {
    const whereSalary = await this.filterSalaries(studentId);
    const ans = await this.jobRepo.findOne({
      where: { attachments: { [Op.contains]: [filename] }, active: true },
      include: [
        {
          model: SalaryModel,
          as: "salaries",
          where: whereSalary,
          required: true,
        },
      ],
    });

    return ans;
  }

  async addResume(studentId: string, filepath: string, name: string, t: Transaction) {
    // Check current resume count for the student
    const currentResumeCount = await this.resumeRepo.count({
      where: { studentId },
      transaction: t,
    });

    // Enforce maximum resume limit
    if (currentResumeCount >= MAX_RESUMES_PER_STUDENT) {
      throw new BadRequestException(
        `Cannot upload more than ${MAX_RESUMES_PER_STUDENT} resumes. Please delete some existing resumes before uploading new ones.`
      );
    }

    const ans = await this.resumeRepo.create({ studentId, filepath, name }, { transaction: t });

    return { status: "success", message: "Resume added successfully", resumeId: ans.id };
  }

  async deleteResumes(studentId: string, filepath: string | string[], t: Transaction) {
    const jobs = await this.sequelizeInstance.query(
      `
      WITH resume_cte AS (
        SELECT id FROM "Resume" WHERE "studentId" = '${studentId}' AND "filepath" = '${filepath}'
      ),
      application_cte AS (
        SELECT "jobId" FROM "Application" WHERE "resumeId" IN (SELECT id FROM resume_cte)
      ),
      job_cte AS (
        SELECT * FROM "Job" WHERE "id" IN (SELECT "jobId" FROM application_cte)
      )
      SELECT job_cte.role, "Company".name 
      FROM "Company"
      INNER JOIN job_cte ON job_cte."companyId" = "Company".id
      WHERE "Company".id IN (SELECT "companyId" FROM job_cte)
    `,
      { replacements: { studentId, filepath }, type: sequelize.QueryTypes.SELECT, transaction: t }
    );

    if (jobs.length > 0) {
      const job = jobs?.[0] as { role: string; name: string };
      throw new ForbiddenException(
        `Cannot delete resume as it is associated with an active job application: ${job.role}, ${job.name}`
      );
    }

    const ans = await this.resumeRepo.destroy({ where: { studentId, filepath }, transaction: t });

    return ans;
  }

  async registerSeason(studentId: string, seasonId: string) {
    const student = await this.studentRepo.findByPk(studentId);
    if (!student) {
      throw new NotFoundException(`Student with id ${studentId} not found`);
    }

    if (
      student.backlog === null ||
      student.backlog === undefined ||
      student.tenthMarks === null ||
      student.tenthMarks === undefined ||
      student.twelthMarks === null ||
      student.twelthMarks === undefined
    ) {
      throw new BadRequestException("Please complete your profile onboarding before registering for seasons");
    }

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
    const student = await this.studentRepo.findByPk(studentId);
    if (!student) {
      throw new NotFoundException(`Student with id ${studentId} not found`);
    }

    if (
      student.backlog === null ||
      student.backlog === undefined ||
      student.tenthMarks === null ||
      student.tenthMarks === undefined ||
      student.twelthMarks === null ||
      student.twelthMarks === undefined
    ) {
      throw new BadRequestException("Please complete your profile onboarding before modifying season registrations");
    }

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

  async updateOnboarding(studentId: string, updateData: OnboardingUpdateDto) {
    const currentStudent = await this.studentRepo.findByPk(studentId);

    if (!currentStudent) {
      throw new NotFoundException(`Student with id ${studentId} not found`);
    }

    const updates: any = {};

    if (updateData.backlog !== undefined) {
      if (currentStudent.backlog !== null && currentStudent.backlog !== undefined) {
        throw new BadRequestException("Backlog status has already been set and cannot be modified");
      }
      updates.backlog = updateData.backlog;
    }

    if (updateData.tenthMarks !== undefined) {
      if (currentStudent.tenthMarks !== null && currentStudent.tenthMarks !== undefined) {
        throw new BadRequestException("10th marks have already been set and cannot be modified");
      }
      updates.tenthMarks = updateData.tenthMarks;
    }

    if (updateData.twelthMarks !== undefined) {
      if (currentStudent.twelthMarks !== null && currentStudent.twelthMarks !== undefined) {
        throw new BadRequestException("12th marks have already been set and cannot be modified");
      }
      updates.twelthMarks = updateData.twelthMarks;
    }

    if (Object.keys(updates).length === 0) {
      return { message: "No updates to apply" };
    }

    await this.studentRepo.update(updates, {
      where: { id: studentId },
    });

    return { message: "Onboarding data updated successfully" };
  }
}
