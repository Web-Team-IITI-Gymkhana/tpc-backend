import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { APPLICATION_DAO, EVENT_DAO, JOB_COORDINATOR_DAO, JOB_DAO, RESUME_DAO, PROGRAM_DAO } from "src/constants";
import {
  ApplicationModel,
  CompanyModel,
  EventModel,
  JobCoordinatorModel,
  JobModel,
  ProgramModel,
  RecruiterModel,
  ResumeModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  TpcMemberModel,
  UserModel,
} from "src/db/models";
import { JobsQueryDto } from "./dtos/query.dto";
import { FindOptions, Op, Transaction } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateApplicationDto, CreateJobCoordinatorsDto } from "./dtos/post.dto";
import { UpdateJobsDto } from "./dtos/patch.dto";

@Injectable()
export class JobService {
  constructor(
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(PROGRAM_DAO) private programRepo: typeof ProgramModel,
    @Inject(RESUME_DAO) private resumeRepo: typeof ResumeModel,
    @Inject(EVENT_DAO) private eventRepo: typeof EventModel,
    @Inject(APPLICATION_DAO) private applicationRepo: typeof ApplicationModel,
    @Inject(JOB_COORDINATOR_DAO) private jobCoordinatorRepo: typeof JobCoordinatorModel
  ) {}

  async getJobs(where: JobsQueryDto) {
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
    const order = parseOrder(where.orderBy || {});
    findOptions.order = order.length > 0 ? order : [["updatedAt", "DESC"]];

    const ans = await this.jobRepo.findAll(findOptions);

    return ans.map((job) => job.get({ plain: true }));
  }

  async getJob(id: string) {
    const ans = await this.jobRepo.findByPk(id, {
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
        },
      ],
    });

    const allPrograms = await this.programRepo.findAll();
    const programDict = allPrograms.reduce((acc, program) => {
      acc[program.id] = program.get({ plain: true });

      return acc;
    }, {});

    const modifiedAns = {
      ...ans.get({ plain: true }),
      salaries: ans.salaries.map((salary) => ({
        ...salary.get({ plain: true }),
        programs: salary.programs.map((programId) => {
          const program = programDict[programId];

          return {
            id: program.id,
            branch: program.branch,
            course: program.course,
            year: program.year,
            department: program.department,
          };
        }),
      })),
    };

    return modifiedAns;
  }

  async createJobCoordinators(jobCoordinators: CreateJobCoordinatorsDto[]) {
    const ans = await this.jobCoordinatorRepo.bulkCreate(jobCoordinators);

    return ans.map((jobCoordinator) => jobCoordinator.id);
  }

  async createApplication(body: CreateApplicationDto[]) {
    const resumeIds = body.map((item) => item.resumeId);
    const eventIds = body.map((item) => item.eventId);

    const resumes = await this.resumeRepo.findAll({
      where: {
        id: {
          [Op.in]: resumeIds,
        },
      },
    });

    const events = await this.eventRepo.findAll({
      where: {
        id: {
          [Op.in]: eventIds,
        },
      },
    });

    const eventRoundMap = events.reduce((acc, event) => {
      acc[event.id] = event.roundNumber;

      return acc;
    }, {});

    const eventJobMap = events.reduce((acc, event) => {
      acc[event.id] = event.jobId;

      return acc;
    }, {});

    const resumeStudentMap = resumes.reduce((acc, resume) => {
      acc[resume.id] = resume.studentId;

      return acc;
    }, {});

    const filteredBody = body.filter((item) => {
      return eventRoundMap[item.eventId] === 0;
    });

    const updatedBody = filteredBody.map((item) => ({
      ...item,
      studentId: resumeStudentMap[item.resumeId],
      jobId: eventJobMap[item.eventId],
    }));

    const ans = await this.applicationRepo.bulkCreate(updatedBody);

    return ans.map((application) => application.id);
  }

  async getJD(filename: string) {
    const ans = await this.jobRepo.findOne({
      where: { attachments: { [Op.contains]: [filename] } },
    });

    return ans;
  }

  async updateJob(job: UpdateJobsDto) {
    const [ans] = await this.jobRepo.update(job, { where: { id: job.id } });

    return ans > 0 ? [] : [job.id];
  }

  async deleteJobs(ids: string | string[]) {
    const ans = await this.jobRepo.destroy({ where: { id: ids } });

    return ans;
  }

  async deleteJobCoordinators(ids: string | string[]) {
    const ans = await this.jobCoordinatorRepo.destroy({ where: { id: ids } });

    return ans;
  }

  async addAttachment(body: { filename: string; jobId: string }, t: Transaction) {
    const job = await this.jobRepo.findByPk(body.jobId, { transaction: t });

    if (!job) {
      throw new NotFoundException(`The Job with id: ${body.jobId} does not exist`);
    }

    const attachments = job.attachments ? [...job.attachments, body.filename] : [body.filename];

    const [ans] = await this.jobRepo.update({ attachments }, { where: { id: body.jobId }, transaction: t });

    return ans;
  }

  async deleteAttachments(filenames: string | string[], t: Transaction) {
    if (!Array.isArray(filenames)) {
      filenames = [filenames];
    }

    const ans = await this.jobRepo.update(
      { attachments: null },
      { where: { attachments: { [Op.overlap]: filenames } }, transaction: t }
    );

    return ans;
  }
}
