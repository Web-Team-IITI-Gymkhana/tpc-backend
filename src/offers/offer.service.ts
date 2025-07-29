import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { OFF_CAMPUS_OFFER_DAO, ON_CAMPUS_OFFER_DAO, SALARY_DAO, STUDENT_DAO } from "src/constants";
import {
  ApplicationModel,
  CompanyModel,
  JobModel,
  OffCampusOfferModel,
  OnCampusOfferModel,
  ProgramModel,
  RegistrationModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  UserModel,
} from "src/db/models";
import { OffCampusOffersQueryDto, OnCampusOffersQueryDto } from "./dtos/query.dto";
import { FindOptions, Op, WhereOptions } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateOffCampusOffersDto, CreateOnCampusOffersDto } from "./dtos/post.dto";
import { UpdateOffCampusOffersDto, UpdateOnCampusOffersDto } from "./dtos/patch.dto";
import { StudentSalariesQueryDto } from "src/student-view/salary/dtos/query.dto";
import { CategoryEnum, DepartmentEnum, GenderEnum } from "src/enums";

@Injectable()
export class OfferService {
  constructor(
    @Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel,
    @Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
    @Inject(ON_CAMPUS_OFFER_DAO) private onCampusOfferRepo: typeof OnCampusOfferModel,
    @Inject(OFF_CAMPUS_OFFER_DAO) private offCampusOfferRepo: typeof OffCampusOfferModel
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

  async getOnCampusOffers(where: OnCampusOffersQueryDto) {
    const findOptions: FindOptions<OnCampusOfferModel> = {
      include: [
        {
          model: SalaryModel,
          as: "salary",
          required: true,
          include: [
            {
              model: JobModel,
              as: "job",
              required: true,
              include: [
                {
                  model: SeasonModel,
                  as: "season",
                },
                {
                  model: CompanyModel,
                  as: "company",
                },
              ],
            },
          ],
        },
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
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.onCampusOfferRepo.findAll(findOptions);

    return ans.map((offer) => offer.get({ plain: true }));
  }

  async getOffCampusOffers(where: OffCampusOffersQueryDto) {
    const findOptions: FindOptions<OffCampusOfferModel> = {
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
          model: CompanyModel,
          as: "company",
        },
        {
          model: SeasonModel,
          as: "season",
        },
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.offCampusOfferRepo.findAll(findOptions);

    return ans.map((offer) => offer.get({ plain: true }));
  }

  async getSalaries(jobId: string, studentId: string) {
    const whereSalary = await this.filterSalaries(studentId);
    const findOptions: FindOptions<SalaryModel> = {
      include: [
        {
          model: JobModel,
          as: "job",
          where: { active: true, id: jobId },
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

    const ans = await this.salaryRepo.findAll(findOptions);

    return ans.map((salary) => salary.get({ plain: true }));
  }

  async getOffersByJob(jobId: string) {
    const findOptions: FindOptions<OnCampusOfferModel> = {
      include: [
        {
          model: SalaryModel,
          as: "salary",
          required: true,
          include: [
            {
              model: JobModel,
              as: "job",
              required: true,
              where: { id: jobId },
              include: [
                {
                  model: SeasonModel,
                  as: "season",
                },
                {
                  model: CompanyModel,
                  as: "company",
                },
              ],
            },
          ],
        },
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
      ],
    };

    const ans = await this.onCampusOfferRepo.findAll(findOptions);

    return ans.map((offer) => offer.get({ plain: true }));
  }

  async createOnCampusOffers(offers: CreateOnCampusOffersDto[]) {
    const ans = await this.onCampusOfferRepo.bulkCreate(offers);

    return ans.map((offer) => offer.id);
  }

  async createOffCampusOffers(offers: CreateOffCampusOffersDto[]) {
    const ans = await this.offCampusOfferRepo.bulkCreate(offers);

    return ans.map((offer) => offer.id);
  }

  async updateOnCampusOffer(offer: UpdateOnCampusOffersDto) {
    const [ans] = await this.onCampusOfferRepo.update(offer, { where: { id: offer.id } });

    return ans > 0 ? [] : [offer.id];
  }

  async updateOffCampusOffer(offer: UpdateOffCampusOffersDto) {
    const [ans] = await this.offCampusOfferRepo.update(offer, { where: { id: offer.id } });

    return ans > 0 ? [] : [offer.id];
  }

  async deleteOnCampusOffers(ids: string | string[]) {
    const ans = await this.onCampusOfferRepo.destroy({ where: { id: ids } });

    return ans;
  }

  async deleteOffCampusOffers(ids: string | string[]) {
    const ans = await this.offCampusOfferRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
