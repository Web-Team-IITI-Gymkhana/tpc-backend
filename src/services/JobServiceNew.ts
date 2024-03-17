import { Inject, Injectable } from "@nestjs/common";
import { JOB_COORDINATOR_DAO, JOB_DAO } from "src/constants";
import { CompanyModel, FacultyApprovalRequestModel, FacultyModel, JobCoordinatorModel, JobModel, JobStatusModel, RecruiterModel, SeasonModel, TpcMemberModel, UserModel } from "src/db/models";
import { Job } from "src/entities/Job";

@Injectable()
export class JobServiceNew {
    constructor(@Inject(JOB_DAO) private jobRepo: typeof JobModel,
                @Inject(JOB_COORDINATOR_DAO) private jobCoordinatorRepo: typeof JobModel) {}

    async getJobs(filters, options) : Promise<Job[]> {
        const restrictions = {
            where: filters[0],
            include: [
                {
                    model: SeasonModel,
                    as: 'season',
                    where: filters[1],
                    required: true,
                },
                {
                    model: JobStatusModel,
                    as: 'currentStatus',
                    where: filters[2],
                    required: true,
                },
                {
                    model: CompanyModel,
                    as: 'company',
                    where: filters[3],
                    required: true,
                }
            ]
        };
        Object.assign(restrictions, options);

        const jobs = await this.jobRepo.findAll(restrictions);
        return jobs.map((job) => Job.fromModel(job));
    }

    async getJob(id: string) : Promise<Job> {
        const ans = await this.jobRepo.findByPk(id,{
            include: [
                {
                    model: SeasonModel,
                    as: 'season',
                },
                {
                    model: CompanyModel,
                    as: 'company',
                },
                {
                    model: JobStatusModel,
                    as: 'currentStatus',
                },
                {
                    model: JobStatusModel,
                    as: 'jobStatuses',
                },
                {
                    model: RecruiterModel,
                    as: 'recruiter',
                    include: [
                        {
                            model: UserModel,
                            as: 'user'
                        },
                        {
                            model: CompanyModel,
                            as: 'company'
                        }
                    ]
                },
                {
                    model: JobCoordinatorModel,
                    as: 'jobCoordinators',
                    include: [
                        {
                            model: TpcMemberModel,
                            as: 'tpcMember',
                            include: [
                                {
                                    model: UserModel,
                                    as: 'user',
                                }
                            ]
                        }
                    ]
                },
                {
                    model: FacultyApprovalRequestModel,
                    as: 'facultyApprovalRequests',
                    include : [
                        {
                            model: FacultyModel,
                            as: 'faculty',
                            include: [
                                {
                                    model: UserModel,
                                    as: 'user',
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        return Job.fromModel(ans);
    }

    async createCoordinators(coordinators: any) : Promise<Array<string>> {
        const ans = await this.jobCoordinatorRepo.bulkCreate(coordinators);
        return ans.map((data) => data.id);
    }
}