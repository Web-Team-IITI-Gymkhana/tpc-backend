import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transaction } from "sequelize";
import { EVENT_DAO } from "src/constants";
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

  async deleteEvent(eventId: string, t?: Transaction) {
    await this.eventRepo.destroy({ where: { id: eventId }, transaction: t });
  }
}

export default EventService;
