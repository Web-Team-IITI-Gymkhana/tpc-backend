import { ApplicationModel } from "src/db/models";
import { Job } from "./Job";
import { Student } from "./Student";
import { Resume } from "./Resume";
import { Event } from "./Event";

export class Application {
  id?: string;
  jobId: string;
  job?: Job;
  studentId: string;
  student?: Student;
  resumeId: string;
  resume?: Resume;
  status?: string;
  eventId: string;
  event?: Event;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    jobId: string;
    job?: Job;
    studentId: string;
    student?: Student;
    resumeId: string;
    resume?: Resume;
    status?: string;
    eventId: string;
    event?: Event;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(poll: ApplicationModel): Application {
    return new this({
      id: poll.id,
      studentId: poll.studentId,
      student: poll.student && Student.fromModel(poll.student),
      jobId: poll.jobId,
      job: poll.job && Job.fromModel(poll.job),
      resumeId: poll.resumeId,
      resume: poll.resume && Resume.fromModel(poll.resume),
      eventId: poll.eventId,
      event: poll.event && Event.fromModel(poll.event),
      status: poll.status,
      createdAt: poll.createdAt,
      updatedAt: poll.updatedAt,
    });
  }
}
