import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FindOptions, Includeable, literal, Op } from "sequelize";
import { APPLICATION_DAO, EVENT_DAO } from "src/constants";
import {
  ApplicationModel,
  CompanyModel,
  EventModel,
  JobModel,
  ProgramModel,
  ResumeModel,
  SeasonModel,
  StudentModel,
  UserModel,
} from "src/db/models";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { ApplicationsQueryDto, EventsQueryDto } from "./dtos/query.dto";
import { CreateEventsDto } from "./dtos/post.dto";
import { UpdateEventsDto } from "./dtos/patch.dto";

@Injectable()
export class EventService {
  constructor(
    @Inject(EVENT_DAO) private eventRepo: typeof EventModel,
    @Inject(APPLICATION_DAO) private applicationRepo: typeof ApplicationModel
  ) {}

  async getEvents(where: EventsQueryDto) {
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

  async getEvent(id: string, where: ApplicationsQueryDto) {
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

  async createEvents(events: CreateEventsDto[]) {
    const ans = await this.eventRepo.bulkCreate(events);

    return ans.map((event) => event.id);
  }

  async updateEvent(event: UpdateEventsDto) {
    const [ans] = await this.eventRepo.update(event, { where: { id: event.id } });

    return ans > 0 ? [] : [event.id];
  }

  async updateApplications(eventId: string, studentIds: string[]) {
    const [ans] = await this.applicationRepo.update(
      { eventId: eventId },
      {
        where: {
          [Op.and]: [
            { studentId: studentIds },
            literal(`"jobId" IN (SELECT "jobId" FROM "Event" WHERE "id" = '${eventId}')`),
          ],
        },
      }
    );

    return ans;
  }

  async deleteEvents(ids: string | string[]) {
    const ans = await this.eventRepo.destroy({ where: { id: ids } });

    return ans;
  }

  async deleteApplications(ids: string | string[]) {
    const ans = await this.applicationRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
