import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { APPLICATION_DAO, EVENT_DAO, JOB_DAO, TPC_MEMBER_DAO } from "src/constants";
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
import { FindOptions } from "sequelize";
import { JobsQueryDto } from "src/job/dtos/query.dto";
import { parsePagesize, parseFilter, parseOrder } from "src/utils";
import { Op } from "sequelize";
import { UpdateJobsDto } from "./dto/patch.dto";
import { ApplicationsQueryDto, EventsQueryDto } from "src/event/dtos/query.dto";

@Injectable()
export class TpcMemberViewService {
  constructor(
    @Inject(TPC_MEMBER_DAO) private tpcMemberRepo: typeof TpcMemberModel,
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(EVENT_DAO) private eventRepo: typeof EventModel,
    @Inject(APPLICATION_DAO) private applicationRepo: typeof ApplicationModel
  ) {}

  async getTpcMember(id: string) {
    const ans = await this.tpcMemberRepo.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
    });

    if (!ans) throw new NotFoundException(`The Tpc Member with id ${id} does not exist`);

    return ans.get({ plain: true });
  }

  async getJobs(where: JobsQueryDto, tpcMemberId: string) {
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
          model: JobCoordinatorModel,
          as: "jobCoordinators",
          required: true,
          where: {
            tpcMemberId: tpcMemberId,
          },
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

  async getJob(id: string, tpcMemberId: string) {
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
          where: {
            tpcMemberId: {
              [Op.eq]: tpcMemberId,
            },
          },
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
        },
      ],
    });

    if (!ans) throw new UnauthorizedException(`The Job with id: ${id} does not exist`);

    return ans.get({ plain: true });
  }

  async getEvents(where: EventsQueryDto, tpcMemberId: string) {
    const findOptions: FindOptions<EventModel> = {
      include: [
        {
          model: JobModel,
          as: "job",
          required: true,
          include: [
            {
              model: CompanyModel,
              as: "company",
            },
            {
              model: JobCoordinatorModel,
              as: "jobCoordinators",
              required: true,
              where: {
                tpcMemberId: tpcMemberId,
              },
            },
            {
              model: SeasonModel,
              as: "season",
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

  async getEvent(id: string, where: ApplicationsQueryDto, tpcMemberId: string) {
    const findOptions: FindOptions<ApplicationModel> = {
      where: { eventId: id },
      include: [
        {
          model: StudentModel,
          as: "student",
          required: true,
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
        {
          model: ResumeModel,
          as: "resume",
        },
        {
          model: JobModel,
          as: "job",
          required: true,
          include: [
            {
              model: JobCoordinatorModel,
              as: "jobCoordinators",
              required: true,
              where: {
                tpcMemberId: tpcMemberId,
              },
            },
          ],
        },
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const [ans, applications] = await Promise.all([
      this.eventRepo.findByPk(id, {
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
              {
                model: JobCoordinatorModel,
                as: "jobCoordinators",
                required: true,
                where: {
                  tpcMemberId: tpcMemberId,
                },
              },
            ],
          },
        ],
      }),
      this.applicationRepo.findAll(findOptions),
    ]);

    if (!ans) throw new NotFoundException(`Event with id ${id} not found`);

    return {
      ...ans.get({ plain: true }),
      applications: applications.map((application) => application.get({ plain: true })),
    };
  }

  async updateJob(job: UpdateJobsDto, jobId: string, tpcMemberId: string) {
    const jobExists = await this.jobRepo.findOne({
      where: { id: jobId },
      include: [
        {
          model: JobCoordinatorModel,
          as: "jobCoordinators",
          where: { tpcMemberId: tpcMemberId },
        },
      ],
    });

    if (!jobExists) {
      throw new UnauthorizedException(`Unauthorized`);
    }

    const [affectedRows] = await this.jobRepo.update(job, { where: { id: jobId } });

    return affectedRows > 0 ? [] : [jobId];
  }
}
