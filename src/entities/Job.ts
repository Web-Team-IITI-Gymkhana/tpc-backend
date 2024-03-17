import { JobModel } from "src/db/models";
import { Company } from "./Company";
import { Recruiter } from "./Recruiter";
import { Season } from "./Season";
import { Event } from "./Event";
import { JobStatus } from "./JobStatus";
import { Category, Gender } from "src/db/enums";
import { Salary } from "./Salary";
import { CompanyDetailsDto, RecruiterDetailsDto, SalaryDetailsDto, SelectionProcedureDetailsDto } from "src/dtos/jaf";
import { JobCoordinator } from "./JobCoordinator";
import { FacultyApprovalRequest } from "./FacultyApprovalRequest";

export class Job {
  id?: string;
  seasonId: string;
  season?: Season;
  recruiterId?: string;
  recruiter?: Recruiter;
  companyId?: string;
  company?: Company;
  role: string;
  description?: string;
  skills: string;
  location: string;
  noOfVacancies?: number;
  offerLetterReleaseDate?: string;
  joiningDate?: string;
  duration?: number;
  selectionProcedure: SelectionProcedureDetailsDto;
  salaries?: Salary[];
  others?: string;
  currentStatusId?: string;
  currentStatus?: JobStatus;
  attachment?: string;
  companyDetailsFilled?: CompanyDetailsDto;
  recruiterDetailsFilled?: RecruiterDetailsDto;
  jobStatuses?: JobStatus[];
  events?: Event[];
  active: boolean;
  jobCoordinators?: JobCoordinator[];
  facultyApprovalRequests?: FacultyApprovalRequest[];


  constructor(input: {
    id?: string;
    seasonId: string;
    season?: Season;
    recruiterId?: string;
    recruiter?: Recruiter;
    companyId?: string;
    company?: Company;
    role: string;
    description?: string;
    skills: string;
    location: string;
    noOfVacancies?: number;
    offerLetterReleaseDate?: string;
    joiningDate?: string;
    duration?: number;
    selectionProcedure: SelectionProcedureDetailsDto;
    salaries?: Salary[];
    others?: string;
    attachment?: string;
    currentStatusId?: string;
    currentStatus?: JobStatus;
    companyDetailsFilled?: object;
    recruiterDetailsFilled?: object;
    jobStatuses?: JobStatus[];
    events?: Event[];
    active: boolean;
    jobCoordinators?: JobCoordinator[];
    facultyApprovalRequests?: FacultyApprovalRequest[];
  }) {
    Object.assign(this, input);
  }

  static fromModel(job: JobModel) {
    return new this({
      id: job.id,
      seasonId: job.seasonId,
      season: job.season && Season.fromModel(job.season),
      recruiterId: job.recruiterId,
      recruiter: job.recruiter && Recruiter.fromModel(job.recruiter),
      companyId: job.companyId,
      company: job.company && Company.fromModel(job.company),
      role: job.role,
      description: job.description,
      skills: job.skills,
      location: job.location,
      noOfVacancies: job.noOfVacancies,
      offerLetterReleaseDate: job.offerLetterReleaseDate,
      joiningDate: job.joiningDate,
      duration: job.duration,
      selectionProcedure: job.selectionProcedure as SelectionProcedureDetailsDto,
      salaries: job.salaries && job.salaries.map((salary) => Salary.fromModel(salary)),
      others: job.others,
      attachment: job.attachment,
      currentStatusId: job.currentStatusId,
      currentStatus: job.currentStatus && JobStatus.fromModel(job.currentStatus),
      companyDetailsFilled: job.companyDetailsFilled,
      recruiterDetailsFilled: job.recruiterDetailsFilled,
      jobStatuses: job.jobStatuses && job.jobStatuses.map((jobStatus) => JobStatus.fromModel(jobStatus)),
      active: job.active,
      jobCoordinators: job.jobCoordinators && job.jobCoordinators.map((jobCoordinator) => JobCoordinator.fromModel(jobCoordinator)),
      facultyApprovalRequests: job.facultyApprovalRequests && job.facultyApprovalRequests.map((request) => FacultyApprovalRequest.fromModel(request)),
    })
  }
}
