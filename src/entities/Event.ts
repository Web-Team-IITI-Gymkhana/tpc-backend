import { EventStatus, EventType } from "src/db/enums";
import { EventModel } from "src/db/models";

export class Event {
  id?: string;
  jobId: string;
  type: EventType;
  roundNumber: Number;
  status: EventStatus;
  metadata?: object;
  startDateTime?: Date;
  endDateTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    jobId: string;
    type: EventType;
    roundNumber: Number;
    status: EventStatus;
    metadata?: object;
    startDateTime?: Date;
    endDateTime?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(event: EventModel): Event {
    return new this({
      id: event.id,
      jobId: event.jobId,
      type: event.type,
      roundNumber: event.roundNumber,
      status: event.status,
      metadata: event.metadata,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    });
  }
}
