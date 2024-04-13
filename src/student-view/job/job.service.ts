import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import sequelize, { Includeable, Sequelize, WhereOptions } from "sequelize";
import { Op } from "sequelize";
import { STUDENT_DAO, SALARY_DAO, APPLICATION_DAO, RESUME_DAO, JOB_DAO, SEQUELIZE_DAO } from "src/constants";
import {
  ApplicationModel,
  CompanyModel,
  EventModel,
  JobCoordinatorModel,
  JobModel,
  ProgramModel,
  ResumeModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  TpcMemberModel,
  UserModel,
} from "src/db/models";
import { RegistrationModel } from "src/db/models/RegistrationModel";

@Injectable()
export class JobService {
  constructor(
    @Inject(APPLICATION_DAO) private applicationRepo: typeof ApplicationModel,
    @Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
    @Inject(RESUME_DAO) private resumeRepo: typeof ResumeModel,
    @Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel
  ) {}

  async getSalaries(id: string, applications?: number, salaryId?: string, event?: boolean) {
    const where = {
      [Op.and]: [
        sequelize.literal(
          `(NOT ("criteria" ? 'programs') OR ("criteria"->'programs' @> 
          jsonb_build_array("job->season->registrations->student"."programId")))`
        ),
        sequelize.literal(
          `(NOT ("criteria" ? 'genders') OR ("criteria"->'genders' @> 
          jsonb_build_array("job->season->registrations->student"."gender")))`
        ),
        sequelize.literal(
          `(NOT ("criteria" ? 'categories') OR ("criteria"->'categories' @> 
          jsonb_build_array("job->season->registrations->student"."category")))`
        ),
        sequelize.literal(
          `(NOT ("criteria" ? 'minCPI') OR (("criteria"->'minCPI')::numeric <= "job->season->registrations->student"."cpi"))`
        ),
        sequelize.literal(
          `(NOT ("criteria" ? 'tenthMarks') OR (("criteria"->'tenthMarks')::numeric <= 
          "job->season->registrations->student"."tenthMarks"))`
        ),
        sequelize.literal(
          `(NOT ("criteria" ? 'twelthMarks') OR (("criteria"->'twelthMarks')::numeric <= 
          "job->season->registrations->student"."twelthMarks"))`
        ),
        sequelize.literal(
          `(NOT ("criteria" ? 'facultyApprovals') OR (NOT ("criteria"->'facultyApprovals' @> 
          jsonb_build_array("job->season->registrations->student->program"."department"))))`
        ),
      ],
    };

    const eventInclude = {
      model: EventModel,
      as: "events",
      attributes: ["id", "roundNumber"],
    };

    const include: Includeable[] = [
      {
        model: SeasonModel,
        as: "season",
        attributes: ["id", "type", "year"],
        include: [
          {
            model: RegistrationModel,
            as: "registrations",
            required: true,
            attributes: ["id"],
            include: [
              {
                model: StudentModel,
                as: "student",
                where: { id: id },
                attributes: ["programId", "gender", "category", "cpi", "tenthMarks", "twelthMarks"],
                include: [
                  {
                    model: ProgramModel,
                    as: "program",
                    attributes: ["department"],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        model: CompanyModel,
        as: "company",
        attributes: ["id", "name"],
      },
      {
        model: ApplicationModel,
        as: "applications",
        attributes: ["id", "resumeId"],
        where: { studentId: id },
        required: false,
      },
    ];

    if (salaryId) Object.assign(where, { id: salaryId });
    if (event) include.push(eventInclude);

    const ans = await this.salaryRepo.findAll({
      attributes: ["id", "totalCTC"],
      include: [
        {
          model: JobModel,
          as: "job",
          attributes: ["id", "role"],
          where: { active: true },
          include: include,
        },
      ],
      where: where,
    });

    const res = ans.map((salary) => ({
      salaryId: salary.id,
      totalCTC: salary.totalCTC,
      jobId: salary.job.id,
      role: salary.job.role,
      seasonId: salary.job.season.id,
      seasonType: salary.job.season.type,
      year: salary.job.season.year,
      registrationId: salary.job.season.registrations[0].id,
      companyId: salary.job.company.id,
      companyName: salary.job.company.name,
      applicationId: salary.job.applications[0]?.id,
      resumeId: salary.job.applications[0]?.resumeId,
      events: salary.job.events.map((result) => result.get({ plain: true })),
    }));

    return res.filter((result) => {
      return (applications > 0 && result.applicationId) || (applications === 0 && !result.applicationId);
    });
  }

  async getSalary(id: string, salaryId: string) {
    const where = {
      id: salaryId,
      [Op.and]: [
        sequelize.literal(
          `(NOT ("criteria" ? 'programs') OR ("criteria"->'programs' @> 
          jsonb_build_array("job->season->registrations->student"."programId")))`
        ),
        sequelize.literal(
          `(NOT ("criteria" ? 'genders') OR ("criteria"->'genders' @> 
          jsonb_build_array("job->season->registrations->student"."gender")))`
        ),
        sequelize.literal(
          `(NOT ("criteria" ? 'categories') OR ("criteria"->'categories' @> 
          jsonb_build_array("job->season->registrations->student"."category")))`
        ),
        sequelize.literal(
          `(NOT ("criteria" ? 'minCPI') OR (("criteria"->'minCPI')::numeric <= "job->season->registrations->student"."cpi"))`
        ),
        sequelize.literal(
          `(NOT ("criteria" ? 'tenthMarks') OR (("criteria"->'tenthMarks')::numeric <= 
          "job->season->registrations->student"."tenthMarks"))`
        ),
        sequelize.literal(
          `(NOT ("criteria" ? 'twelthMarks') OR (("criteria"->'twelthMarks')::numeric <= 
          "job->season->registrations->student"."twelthMarks"))`
        ),
        sequelize.literal(
          `(NOT ("criteria" ? 'facultyApprovals') OR (NOT ("criteria"->'facultyApprovals' @> 
          jsonb_build_array("job->season->registrations->student->program"."department"))))`
        ),
      ],
    };

    const ans = await this.salaryRepo.findOne({
      attributes: [
        "id",
        "salaryPeriod",
        "others",
        "baseSalary",
        "totalCTC",
        "takeHomeSalary",
        "grossSalary",
        "otherCompensations",
      ],
      include: [
        {
          model: JobModel,
          as: "job",
          attributes: [
            "id",
            "role",
            "currentStatus",
            "others",
            "description",
            "attachment",
            "skills",
            "location",
            "noOfVacancies",
            "offerLetterReleaseDate",
            "joiningDate",
            "duration",
          ],
          where: { active: true },
          include: [
            {
              model: SeasonModel,
              as: "season",
              attributes: ["id", "type", "year"],
              include: [
                {
                  model: RegistrationModel,
                  as: "registrations",
                  where: { registered: true },
                  attributes: ["id"],
                  include: [
                    {
                      model: StudentModel,
                      as: "student",
                      where: { id: id },
                      attributes: ["programId", "gender", "category", "cpi", "tenthMarks", "twelthMarks"],
                      include: [
                        {
                          model: ProgramModel,
                          as: "program",
                          attributes: ["department"],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: CompanyModel,
              as: "company",
              attributes: ["id", "name", "website", "domains", "category"],
            },
            {
              model: ApplicationModel,
              as: "applications",
              attributes: ["id", "resumeId", "eventId"],
              where: { studentId: id },
              required: false,
            },
            {
              model: EventModel,
              as: "events",
              attributes: ["id", "roundNumber", "type", "metadata", "startDateTime", "endDateTime"],
            },
            {
              model: JobCoordinatorModel,
              as: "jobCoordinators",
              attributes: ["id", "role"],
              include: [
                {
                  model: TpcMemberModel,
                  as: "tpcMember",
                  attributes: ["id", "department", "role"],
                  include: [
                    {
                      model: UserModel,
                      as: "user",
                      attributes: ["name", "email", "contact"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      where: where,
    });
    if (!ans) throw new NotFoundException(`The Salary with id: ${id} Not Found`);

    return ans.get({ plain: true });
  }

  async applySalary(id: string, salaryId: string, resumeId: string) {
    const [[ans], resume] = await Promise.all([
      this.getSalaries(id, 0, salaryId, true),
      this.resumeRepo.findByPk(resumeId),
    ]);
    const event = ans.events.filter((res) => res.roundNumber === 0)[0];

    if (!ans)
      throw new NotFoundException(
        `Salary with id: ${salaryId} not found: You may not be eligible or have already applied`
      );
    if (resume?.studentId !== id || !resume?.verified)
      throw new NotFoundException(`No applicable resume with id: ${resumeId}`);
    if (!event)
      throw new NotFoundException(
        `Poll not found for salary with id: ${salaryId}. It may not have been made or is closed.`
      );

    const res = await this.applicationRepo.create({
      studentId: id,
      resumeId: resumeId,
      jobId: ans.jobId,
      eventId: event.id,
    });

    return res.id;
  }
}
