/*
 * import { Inject, Injectable, Logger } from "@nestjs/common";
 * import { omit } from "lodash";
 * import sequelize from "sequelize";
 * import { Sequelize, Transaction, WhereOptions } from "sequelize";
 * import { COMPANY_DAO, JOB_DAO, JOB_STATUS_DAO, RECRUITER_DAO } from "src/constants";
 * import { JobStatusType } from "src/enums";
 * import { CompanyModel, JobModel, JobStatusModel, RecruiterModel, SeasonModel } from "src/db/models";
 * import { Job } from "src/entities/Job";
 * import { JobStatus } from "src/entities/JobStatus";
 * import { getQueryValues } from "src/utils/utils";
 *
 * @Injectable()
 * class JafService {
 * private logger = new Logger(JafService.name);
 *
 * constructor(
 *  @Inject(JOB_DAO) private jobRepo: typeof JobModel,
 *  @Inject(COMPANY_DAO) private companyRepo: typeof CompanyModel,
 *  @Inject(RECRUITER_DAO) private recruiterRepo: typeof RecruiterModel,
 *  @Inject(JOB_STATUS_DAO) private jobStatusRepo: typeof JobStatusModel
 * ) {}
 *
 * async createJob(job: Job, t?: Transaction) {
 *  const obj = getQueryValues(job);
 *  const jobModel = await this.jobRepo.create(omit(obj, "company", "season", "recruiter", "currentStatus"), {
 *    transaction: t,
 *  });
 *
 *  return Job.fromModel(jobModel);
 * }
 *
 * async getJobs(): Promise<Job[]> {
 *  const ans = await this.jobRepo.findAll();
 *
 *  return ans.map((job) => Job.fromModel(job));
 * }
 *
 * async updateJob(jobId: string, fieldsToUpdate: object, transaction?: Transaction): Promise<Job> {
 *  // eslint-disable-next-line @typescript-eslint/no-unused-vars
 *  const [_, updatedJob] = await this.jobRepo.update(fieldsToUpdate, {
 *    where: { id: jobId },
 *    returning: true,
 *    transaction,
 *  });
 *
 *  return Job.fromModel(updatedJob[0]);
 * }
 *
 * async upsertJobStatusAndUpdateCurrent(jobStatus: JobStatus, transaction?: Transaction) {
 *  const pr1 = this.jobStatusRepo.upsert(jobStatus, {
 *    transaction: transaction,
 *  });
 *  const pr2 = this.jobRepo.findOne({
 *    where: { id: jobStatus.jobId },
 *    include: {
 *      model: JobStatusModel,
 *      as: "currentStatus",
 *      required: true,
 *    },
 *    transaction: transaction,
 *  });
 *  const [[instance], prevJob] = await Promise.all([pr1, pr2]);
 *  const prevStatus = prevJob.currentStatus;
 *  if (prevStatus == JobStatusType.INITIALIZED && jobStatus.status == JobStatusType.SCHEDULED) {
 *    const company = await this.companyRepo.create(prevJob.companyDetailsFilled, {
 *      transaction: transaction,
 *    });
 *    prevJob.recruiterDetailsFilled["companyId"] = company.id;
 *    const recruiter = await this.recruiterRepo.create(prevJob.recruiterDetailsFilled, {
 *      transaction: transaction,
 *    });
 *    const job = await this.updateJob(
 *      instance.jobId,
 *      { currentStatusId: instance.id, companyId: company.id, recruiterId: recruiter.id },
 *      transaction
 *    );
 *
 *    return job;
 *  }
 *  const job = await this.updateJob(instance.jobId, { currentStatusId: instance.id }, transaction);
 *
 *  return job;
 * }
 *
 * async deleteJob(jobId: string, t?: Transaction) {
 *  return !!(await this.jobRepo.destroy({ where: { id: jobId }, transaction: t }));
 * }
 * }
 *
 * export default JafService;
 */
