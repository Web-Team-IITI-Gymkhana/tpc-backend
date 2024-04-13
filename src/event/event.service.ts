import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import sequelize from "sequelize";
import { FindOptions } from "sequelize";
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
import { parsePagesize, parseFilter, parseOrder } from "src/utils";

@Injectable()
export class EventService {
  constructor(
    @Inject(EVENT_DAO) private eventRepo: typeof EventModel,
    @Inject(APPLICATION_DAO) private applicationRepo: typeof ApplicationModel
  ) {}

  async getEvents(where) {
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

  async getEvent(id, where) {
    const findOptions: FindOptions<ApplicationModel> = {
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

    const applicationsInclude = {
      model: ApplicationModel,
      as: "applications",
    };
    Object.assign(applicationsInclude, findOptions);

    const ans = await this.eventRepo.findByPk(id, {
      include: applicationsInclude,
    });

    if (!ans) throw new NotFoundException(`The Event with id: ${id} does not exist`);

    return ans.get({ plain: true });
  }

  async createEvents(events) {
    const ans = await this.eventRepo.bulkCreate(events);

    return ans.map((event) => event.id);
  }

  async updateEvent(event) {
    const [ans] = await this.eventRepo.update(event, { where: { id: event.id } });

    return ans > 0 ? [] : [event.id];
  }

  async addApplications(eventId, emails) {
    const [ans] = await this.applicationRepo.update(
      { eventId: eventId },
      {
        where: sequelize.literal(
          `"studentId" IN (SELECT "id" from "Student" INNER JOIN (SELECT "id" from "User" WHERE "email" IN (${emails
            .map((email) => `'${email}'`)
            .join(",")})) as "users" ON "Student"."userId" = "users"."id"`
        ),
      }
    );

    return ans;
  }

  async deleteEvents(ids: string[]) {
    const ans = await this.eventRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
