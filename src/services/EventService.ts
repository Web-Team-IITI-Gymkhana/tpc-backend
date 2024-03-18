import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transaction, WhereOptions } from "sequelize";
import { EVENT_DAO } from "src/constants";
import { EventStatus } from "src/db/enums";
import { EventModel } from "src/db/models";
import { Event } from "src/entities/Event";

@Injectable()
class EventService {
  private logger = new Logger(EventService.name);

  constructor(@Inject(EVENT_DAO) private eventRepo: typeof EventModel) {}

  async createEvent(event: Event, t?: Transaction) {
    const eventModel = await this.eventRepo.create(event, { transaction: t });

    return Event.fromModel(eventModel);
  }

  async getEvents(where: WhereOptions<EventModel>, t?: Transaction) {
    const eventModels = await this.eventRepo.findAll({ where: where, transaction: t });

    return eventModels.map((eventModel) => Event.fromModel(eventModel));
  }

  async updateEvent(eventId: string, fieldsToUpdate: object, t?: Transaction) {
    const [_, updatedModel] = await this.eventRepo.update(fieldsToUpdate, {
      where: { id: eventId },
      returning: true,
      transaction: t,
    });

    return Event.fromModel(updatedModel[0]);
  }

  async deleteEvent(eventId: string, t?: Transaction) {
    return !!(await this.eventRepo.destroy({ where: { id: eventId }, transaction: t }));
  }
}

export default EventService;
