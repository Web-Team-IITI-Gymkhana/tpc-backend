import { ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { FindOptions, Op, WhereOptions } from "sequelize";
import { APPLICATION_DAO, RESUME_DAO, SALARY_DAO, STUDENT_DAO } from "src/constants";
import {
  ApplicationModel,
  CompanyModel,
  EventModel,
  JobCoordinatorModel,
  JobModel,
  ProgramModel,
  RegistrationModel,
  ResumeModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  TpcMemberModel,
  UserModel,
} from "src/db/models";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { StudentSalariesQueryDto } from "./dtos/query.dto";
import { CategoryEnum, DepartmentEnum, GenderEnum } from "src/enums";
import { JobRegistrationEnum } from "src/enums/jobRegistration.enum";
import { EventTypeEnum } from "src/enums/eventType.enum";

@Injectable()
export class SalaryService {
  constructor(
    @Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel,
    @Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
    @Inject(APPLICATION_DAO) private applicationRepo: typeof ApplicationModel,
    @Inject(RESUME_DAO) private resumeRepo: typeof ResumeModel
  ) {}

  async filterSalaries(studentId: string) {
    const student = await this.studentRepo.findByPk(studentId, { include: [ProgramModel] });
    if (!student) throw new ForbiddenException(`Student with id ${studentId} not found`);
    const department: DepartmentEnum = student.program.department;

    const where: WhereOptions<SalaryModel> = {
      programs: { [Op.or]: { [Op.contains]: [student.programId], [Op.is]: null, [Op.eq]: [] } },
      genders: { [Op.or]: { [Op.contains]: [student.gender as GenderEnum], [Op.is]: null, [Op.eq]: [] } },
      categories: { [Op.or]: { [Op.contains]: [student.category as CategoryEnum], [Op.is]: null, [Op.eq]: [] } },
      minCPI: { [Op.lte]: student.cpi },
      tenthMarks: { [Op.lte]: student.tenthMarks },
      twelthMarks: { [Op.lte]: student.twelthMarks },
      [Op.not]: { facultyApprovals: { [Op.contains]: [department] } },
    };

    return where;
  }

  async getSalaries(where: StudentSalariesQueryDto, studentId: string, registered: boolean) {
    const whereSalary = await this.filterSalaries(studentId);
    const findOptions: FindOptions<SalaryModel> = {
      include: [
        {
          model: JobModel,
          as: "job",
          where: { active: true, registration: JobRegistrationEnum.OPEN },
          include: [
            {
              model: SeasonModel,
              as: "season",
              required: true,
              include: [
                {
                  model: RegistrationModel,
                  as: "registrations",
                  where: { registered: true, studentId: studentId },
                },
              ],
            },
            {
              model: CompanyModel,
              as: "company",
            },
            {
              model: ApplicationModel,
              as: "applications",
              required: false,
              where: { studentId },
            },
          ],
        },
      ],
      where: whereSalary,
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.salaryRepo.findAll(findOptions);

    return ans
      .map((salary) => salary.get({ plain: true }))
      .filter((salary) => {
        const applied = salary.job.applications.length > 0;

        return registered ? applied : !applied;
      });
  }

  async getSalary(salaryId: string, studentId: string) {
    const whereSalary = await this.filterSalaries(studentId);
    const ans = await this.salaryRepo.findOne({
      where: { id: salaryId, ...whereSalary },
      include: [
        {
          model: JobModel,
          as: "job",
          where: { active: true, registration: JobRegistrationEnum.OPEN },
          include: [
            {
              model: SeasonModel,
              as: "season",
              required: true,
              include: [
                {
                  model: RegistrationModel,
                  as: "registrations",
                  where: { registered: true, studentId: studentId },
                },
              ],
            },
            {
              model: CompanyModel,
              as: "company",
            },
            {
              model: ApplicationModel,
              as: "applications",
              required: false,
              where: { studentId },
              include: [
                {
                  model: ResumeModel,
                  as: "resume",
                },
              ],
            },
            {
              model: EventModel,
              as: "events",
            },
            {
              model: JobCoordinatorModel,
              as: "jobCoordinators",
              include: [
                {
                  model: TpcMemberModel,
                  as: "tpcMember",
                  include: [
                    {
                      model: StudentModel,
                      as: "student",
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
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [[{ model: JobModel, as: "job" }, { model: EventModel, as: "events" }, "roundNumber", "ASC"]],
    });

    if (!ans) throw new NotFoundException(`Salary with id ${salaryId} not found`);

    return ans.get({ plain: true });
  }

  async applySalary(salaryId: string, studentId: string, resumeId: string) {
    const whereSalary = await this.filterSalaries(studentId);

    const [ans, res] = await Promise.all([
      this.resumeRepo.findOne({ where: { id: resumeId, studentId } }),
      this.salaryRepo.findOne({
        where: { id: salaryId, ...whereSalary },
        include: [
          {
            model: JobModel,
            as: "job",
            where: { active: true, registration: JobRegistrationEnum.OPEN },
            required: true,
            include: [
              {
                model: EventModel,
                as: "events",
                order: [["roundNumber", "ASC"]],
                limit: 1,
              },
              {
                model: SeasonModel,
                as: "season",
                required: true,
                include: [
                  {
                    model: RegistrationModel,
                    as: "registrations",
                    where: { registered: true, studentId: studentId },
                  },
                ],
              },
            ],
          },
        ],
      }),
    ]);

    if (!ans || !res)
      throw new UnauthorizedException("Not Authorized to apply for this salary or the Resume doesnt exist");
    const application = await this.applicationRepo.create({
      eventId: res.job.events[0].id,
      jobId: res.jobId,
      studentId: studentId,
      resumeId: resumeId,
    });

    return application.id;
  }
}
