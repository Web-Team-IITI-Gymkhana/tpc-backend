/* eslint-disable no-console */
import { Inject, Injectable } from "@nestjs/common";
import {
  CompanyModel,
  JobModel,
  OnCampusOfferModel,
  ProgramModel,
  RegistrationModel,
  SalaryModel,
  StudentModel,
  UserModel,
  SeasonModel,
} from "src/db/models";
import { ON_CAMPUS_OFFER_DAO, PROGRAM_DAO, REGISTRATIONS_DAO, STUDENT_DAO, USER_DAO } from "src/constants";
import { Op, Sequelize } from "sequelize";
import { CategoryEnum, GenderEnum, SeasonTypeEnum } from "src/enums";

@Injectable()
export class AnalyticsDashboardService {
  constructor(
    @Inject(ON_CAMPUS_OFFER_DAO)
    private onCampusRepo: typeof OnCampusOfferModel,
    @Inject(REGISTRATIONS_DAO)
    private registrationsRepo: typeof RegistrationModel,
    @Inject(PROGRAM_DAO) private programRepo: typeof ProgramModel
  ) {}

  private calculateStatistics(ctcArray: number[]) {
    if (ctcArray.length === 0) {
      return {
        highestPackage: 0,
        lowestPackage: 0,
        meanPackage: 0,
        medianPackage: 0,
        modePackage: 0,
      };
    }

    const highestPackage = Math.max(...ctcArray);
    const lowestPackage = Math.min(...ctcArray);
    const meanPackage = ctcArray.reduce((acc, val) => acc + val, 0) / ctcArray.length;

    ctcArray.sort((a, b) => a - b);
    const mid = Math.floor(ctcArray.length / 2);
    const medianPackage = ctcArray.length % 2 !== 0 ? ctcArray[mid] : (ctcArray[mid - 1] + ctcArray[mid]) / 2;

    const modeMap: { [key: number]: number } = {};
    let maxFrequency = 0;
    let modePackage = ctcArray[0];

    ctcArray.forEach((num) => {
      modeMap[num] = (modeMap[num] || 0) + 1;
      if (modeMap[num] > maxFrequency) {
        maxFrequency = modeMap[num];
        modePackage = num;
      }
    });

    return {
      highestPackage,
      lowestPackage,
      meanPackage,
      medianPackage,
      modePackage,
    };
  }

  async getStatsOverall(seasonId: string) {
    const totalRegisteredStudentsCount = await this.registrationsRepo.count({
      col: "studentId",
      distinct: true,
      where: { seasonId: seasonId, registered: true },
    });

    const offers = await this.onCampusRepo.findAll({
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
              where: {
                seasonId: seasonId,
              },
              include: [
                {
                  model: SeasonModel,
                  as: "season",
                  required: true,
                  where: {
                    id: seasonId,
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    const studentIdsSet = new Set();

    offers.forEach((offer) => {
      if (offer.studentId) {
        studentIdsSet.add(offer.studentId);
      }
    });

    const uniqueStudentIds = Array.from(studentIdsSet);

    const companyIds = new Set();

    offers.forEach((offer) => {
      if (offer.salary && offer.salary.job) {
        companyIds.add(offer.salary.job.companyId);
      }
    });

    const ctcArray = [];

    offers.forEach((offer) => {
      if (offer?.salary?.job?.season?.type === SeasonTypeEnum.PLACEMENT && offer?.salary?.totalCTC !== null) {
        ctcArray.push(offer.salary.totalCTC);
      } else if (offer?.salary?.job?.season?.type === SeasonTypeEnum.INTERN && offer?.salary?.stipend !== null) {
        ctcArray.push(offer.salary.stipend);
      }
    });

    const statistics = this.calculateStatistics(ctcArray);

    const uniqueCompanyIds = Array.from(companyIds);
    const totalCompaniesOffering = uniqueCompanyIds.length;
    const totalOffers = offers.length;
    const placedStudentsCount = uniqueStudentIds.length;
    const placementPercentage =
      totalRegisteredStudentsCount === 0 ? 0 : (placedStudentsCount / totalRegisteredStudentsCount) * 100;
    const unplacedPercentage = 100 - placementPercentage;

    return {
      totalRegisteredStudentsCount,
      placedStudentsCount,
      placementPercentage,
      unplacedPercentage,
      totalOffers,
      totalCompaniesOffering,
      ...statistics,
    };
  }
  async getStatsCourseWise(seasonId: string) {
    const programs = await this.programRepo.findAll({
      attributes: ["course"],
      group: ["course"],
    });
    const courses = programs.map((program) => program.course);
    const registrations = await this.registrationsRepo.findAll({
      where: { seasonId: seasonId, registered: true },
      include: [
        {
          model: StudentModel,
          as: "student",
          include: [
            {
              model: ProgramModel,
              as: "program",
            },
          ],
        },
      ],
    });

    const registeredStudents = registrations.map((registration) => registration.student);
    const courseWiseRegisteredCount = {};

    registeredStudents.forEach((student) => {
      const courseId = student.program.course;
      courseWiseRegisteredCount[courseId] = (courseWiseRegisteredCount[courseId] || 0) + 1;
    });

    const offers = await this.onCampusRepo.findAll({
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
              where: {
                seasonId: seasonId,
              },
              include: [
                {
                  model: SeasonModel,
                  as: "season",
                  required: true,
                  where: {
                    id: seasonId,
                  },
                },
              ],
            },
          ],
        },
        {
          model: StudentModel,
          as: "student",
          include: [
            {
              model: ProgramModel,
              as: "program",
            },
          ],
        },
      ],
    });

    const statistics = {
      courseWiseStats: {},
    };

    const courseOffersMap = {};

    offers.forEach((offer) => {
      const courseId = offer.student.program.course;
      courseOffersMap[courseId] = courseOffersMap[courseId] || [];
      courseOffersMap[courseId].push(offer);
    });

    courses.forEach((course) => {
      const courseId = course;
      const courseOffers = courseOffersMap[courseId] || [];
      const courseRegisteredStudentsCount = courseWiseRegisteredCount[courseId] || 0;
      const coursePlacedStudentsCount = new Set(courseOffers.map((offer) => offer.studentId)).size;
      const placementPercentage = (coursePlacedStudentsCount / courseRegisteredStudentsCount) * 100 || 0;
      const unplacedPercentage = 100 - placementPercentage;
      const ctcArray = [];

      courseOffers.forEach((offer) => {
        if (offer?.salary?.job?.season?.type === SeasonTypeEnum.PLACEMENT && offer?.salary?.totalCTC !== null) {
          ctcArray.push(offer.salary.totalCTC);
        } else if (offer?.salary?.job?.season?.type === SeasonTypeEnum.INTERN && offer?.salary?.stipend !== null) {
          ctcArray.push(offer.salary.stipend);
        }
      });

      const stats = this.calculateStatistics(ctcArray);

      statistics.courseWiseStats[courseId] = {
        totalRegisteredStudentsCount: courseRegisteredStudentsCount,
        placedStudentsCount: coursePlacedStudentsCount,
        placementPercentage: placementPercentage,
        unplacedPercentage: unplacedPercentage,
        ...stats,
        totalOffers: courseOffers.length,
        totalCompaniesOffering: new Set(courseOffers.map((offer) => offer.salary.job.companyId)).size,
      };
    });

    return statistics.courseWiseStats;
  }
  async getStatsDepartmentWise(seasonId: string) {
    const programs = await this.programRepo.findAll({
      attributes: ["department"],
      group: ["department"],
    });
    const departmentes = programs.map((program) => program.department);
    const registrations = await this.registrationsRepo.findAll({
      where: { seasonId: seasonId, registered: true },
      include: [
        {
          model: StudentModel,
          as: "student",
          include: [
            {
              model: ProgramModel,
              as: "program",
            },
          ],
        },
      ],
    });

    const registeredStudents = registrations.map((registration) => registration.student);
    const departmentWiseRegisteredCount = {};

    registeredStudents.forEach((student) => {
      const departmentId = student.program.department;
      departmentWiseRegisteredCount[departmentId] = (departmentWiseRegisteredCount[departmentId] || 0) + 1;
    });

    const offers = await this.onCampusRepo.findAll({
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
              where: {
                seasonId: seasonId,
              },
              include: [
                {
                  model: SeasonModel,
                  as: "season",
                  required: true,
                  where: {
                    id: seasonId,
                  },
                },
              ],
            },
          ],
        },
        {
          model: StudentModel,
          as: "student",
          include: [
            {
              model: ProgramModel,
              as: "program",
            },
          ],
        },
      ],
    });

    const statistics = {
      departmentWiseStats: {},
    };

    const departmentOffersMap = {};

    offers.forEach((offer) => {
      const departmentId = offer.student.program.department;
      departmentOffersMap[departmentId] = departmentOffersMap[departmentId] || [];
      departmentOffersMap[departmentId].push(offer);
    });

    departmentes.forEach((department) => {
      const departmentId = department;
      const departmentOffers = departmentOffersMap[departmentId] || [];
      const departmentRegisteredStudentsCount = departmentWiseRegisteredCount[departmentId] || 0;
      const departmentPlacedStudentsCount = new Set(departmentOffers.map((offer) => offer.studentId)).size;
      const placementPercentage = (departmentPlacedStudentsCount / departmentRegisteredStudentsCount) * 100 || 0;
      const unplacedPercentage = 100 - placementPercentage;
      const ctcArray = [];

      departmentOffers.forEach((offer) => {
        if (offer?.salary?.job?.season?.type === SeasonTypeEnum.PLACEMENT && offer?.salary?.totalCTC !== null) {
          ctcArray.push(offer.salary.totalCTC);
        } else if (offer?.salary?.job?.season?.type === SeasonTypeEnum.INTERN && offer?.salary?.stipend !== null) {
          ctcArray.push(offer.salary.stipend);
        }
      });

      const stats = this.calculateStatistics(ctcArray);

      statistics.departmentWiseStats[departmentId] = {
        totalRegisteredStudentsCount: departmentRegisteredStudentsCount,
        placedStudentsCount: departmentPlacedStudentsCount,
        placementPercentage: placementPercentage,
        unplacedPercentage: unplacedPercentage,
        ...stats,
        totalOffers: departmentOffers.length,
        totalCompaniesOffering: new Set(departmentOffers.map((offer) => offer.salary.job.companyId)).size,
      };
    });

    return statistics.departmentWiseStats;
  }
  async getStatsCategoryWise(seasonId: string) {
    const categories = Object.keys(CategoryEnum).map((key) => CategoryEnum[key]);
    const registrations = await this.registrationsRepo.findAll({
      where: { seasonId: seasonId, registered: true },
      include: [
        {
          model: StudentModel,
          as: "student",
        },
      ],
    });

    const registeredStudents = registrations.map((registration) => registration.student);
    const categoryWiseRegisteredCount = {};

    registeredStudents.forEach((student) => {
      const categoryId = student.category;
      categoryWiseRegisteredCount[categoryId] = (categoryWiseRegisteredCount[categoryId] || 0) + 1;
    });

    const offers = await this.onCampusRepo.findAll({
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
              where: {
                seasonId: seasonId,
              },
              include: [
                {
                  model: SeasonModel,
                  as: "season",
                  required: true,
                  where: {
                    id: seasonId,
                  },
                },
              ],
            },
          ],
        },
        {
          model: StudentModel,
          as: "student",
        },
      ],
    });

    const statistics = {
      categoryWiseStats: {},
    };

    const categoryOffersMap = {};

    offers.forEach((offer) => {
      const categoryId = offer.student.category;
      categoryOffersMap[categoryId] = categoryOffersMap[categoryId] || [];
      categoryOffersMap[categoryId].push(offer);
    });

    categories.forEach((category) => {
      const categoryId = category;
      const categoryOffers = categoryOffersMap[categoryId] || [];
      const categoryRegisteredStudentsCount = categoryWiseRegisteredCount[categoryId] || 0;
      const categoryPlacedStudentsCount = new Set(categoryOffers.map((offer) => offer.studentId)).size;
      const placementPercentage = (categoryPlacedStudentsCount / categoryRegisteredStudentsCount) * 100 || 0;
      const unplacedPercentage = 100 - placementPercentage;
      const ctcArray = [];

      categoryOffers.forEach((offer) => {
        if (offer?.salary?.job?.season?.type === SeasonTypeEnum.PLACEMENT && offer?.salary?.totalCTC !== null) {
          ctcArray.push(offer.salary.totalCTC);
        } else if (offer?.salary?.job?.season?.type === SeasonTypeEnum.INTERN && offer?.salary?.stipend !== null) {
          ctcArray.push(offer.salary.stipend);
        }
      });

      const stats = this.calculateStatistics(ctcArray);

      statistics.categoryWiseStats[categoryId] = {
        totalRegisteredStudentsCount: categoryRegisteredStudentsCount,
        placedStudentsCount: categoryPlacedStudentsCount,
        placementPercentage: placementPercentage,
        unplacedPercentage: unplacedPercentage,
        ...stats,
        totalOffers: categoryOffers.length,
        totalCompaniesOffering: new Set(categoryOffers.map((offer) => offer.salary.job.companyId)).size,
      };
    });

    return statistics.categoryWiseStats;
  }
  async getStatsGenderWise(seasonId: string) {
    const genders = Object.keys(GenderEnum).map((key) => GenderEnum[key]);
    const registrations = await this.registrationsRepo.findAll({
      where: { seasonId: seasonId, registered: true },
      include: [
        {
          model: StudentModel,
          as: "student",
        },
      ],
    });

    const registeredStudents = registrations.map((registration) => registration.student);
    const genderWiseRegisteredCount = {};

    registeredStudents.forEach((student) => {
      const genderId = student.gender;
      genderWiseRegisteredCount[genderId] = (genderWiseRegisteredCount[genderId] || 0) + 1;
    });

    const offers = await this.onCampusRepo.findAll({
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
              where: {
                seasonId: seasonId,
              },
              include: [
                {
                  model: SeasonModel,
                  as: "season",
                  required: true,
                  where: {
                    id: seasonId,
                  },
                },
              ],
            },
          ],
        },
        {
          model: StudentModel,
          as: "student",
        },
      ],
    });

    const statistics = {
      genderWiseStats: {},
    };

    const genderOffersMap = {};

    offers.forEach((offer) => {
      const genderId = offer.student.gender;
      genderOffersMap[genderId] = genderOffersMap[genderId] || [];
      genderOffersMap[genderId].push(offer);
    });

    genders.forEach((gender) => {
      const genderId = gender;
      const genderOffers = genderOffersMap[genderId] || [];
      const genderRegisteredStudentsCount = genderWiseRegisteredCount[genderId] || 0;
      const genderPlacedStudentsCount = new Set(genderOffers.map((offer) => offer.studentId)).size;
      const placementPercentage = (genderPlacedStudentsCount / genderRegisteredStudentsCount) * 100 || 0;
      const unplacedPercentage = 100 - placementPercentage;
      const ctcArray = [];

      genderOffers.forEach((offer) => {
        if (offer?.salary?.job?.season?.type === SeasonTypeEnum.PLACEMENT && offer?.salary?.totalCTC !== null) {
          ctcArray.push(offer.salary.totalCTC);
        } else if (offer?.salary?.job?.season?.type === SeasonTypeEnum.INTERN && offer?.salary?.stipend !== null) {
          ctcArray.push(offer.salary.stipend);
        }
      });

      const stats = this.calculateStatistics(ctcArray);

      statistics.genderWiseStats[genderId] = {
        totalRegisteredStudentsCount: genderRegisteredStudentsCount,
        placedStudentsCount: genderPlacedStudentsCount,
        placementPercentage: placementPercentage,
        unplacedPercentage: unplacedPercentage,
        ...stats,
        totalOffers: genderOffers.length,
        totalCompaniesOffering: new Set(genderOffers.map((offer) => offer.salary.job.companyId)).size,
      };
    });

    return statistics.genderWiseStats;
  }

  async getStatsAcademicWise(seasonId: string) {
    // Define CPI ranges (0-10 with 1 point intervals)
    const cpiRanges = [
      { min: 0, max: 1 },
      { min: 1, max: 2 },
      { min: 2, max: 3 },
      { min: 3, max: 4 },
      { min: 4, max: 5 },
      { min: 5, max: 6 },
      { min: 6, max: 7 },
      { min: 7, max: 8 },
      { min: 8, max: 9 },
      { min: 9, max: 10 },
    ];

    // Get all registered students with their CPI
    const registrations = await this.registrationsRepo.findAll({
      where: { seasonId: seasonId, registered: true },
      include: [
        {
          model: StudentModel,
          as: "student",
        },
      ],
    });

    const registeredStudents = registrations.map((registration) => registration.student);
    const cpiWiseRegisteredCount = {};

    // Initialize counts for each range
    cpiRanges.forEach((range) => {
      const rangeKey = `${range.min}-${range.max}`;
      cpiWiseRegisteredCount[rangeKey] = 0;
    });

    // Count students in each CPI range
    registeredStudents.forEach((student) => {
      const cpi = student.cpi;
      cpiRanges.forEach((range) => {
        const rangeKey = `${range.min}-${range.max}`;
        if (cpi >= range.min && cpi < range.max) {
          cpiWiseRegisteredCount[rangeKey]++;
        }
      });
    });

    // Get all offers with student details
    const offers = await this.onCampusRepo.findAll({
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
              where: {
                seasonId: seasonId,
              },
              include: [
                {
                  model: SeasonModel,
                  as: "season",
                  required: true,
                  where: {
                    id: seasonId,
                  },
                },
              ],
            },
          ],
        },
        {
          model: StudentModel,
          as: "student",
        },
      ],
    });

    const statistics = {
      academicWiseStats: {},
    };

    const cpiOffersMap = {};

    // Group offers by CPI ranges
    offers.forEach((offer) => {
      const studentCpi = offer.student.cpi;
      cpiRanges.forEach((range) => {
        const rangeKey = `${range.min}-${range.max}`;
        if (studentCpi >= range.min && studentCpi < range.max) {
          cpiOffersMap[rangeKey] = cpiOffersMap[rangeKey] || [];
          cpiOffersMap[rangeKey].push(offer);
        }
      });
    });

    // Calculate statistics for each CPI range
    cpiRanges.forEach((range) => {
      const rangeKey = `${range.min}-${range.max}`;
      const rangeOffers = cpiOffersMap[rangeKey] || [];
      const registeredStudentsCount = cpiWiseRegisteredCount[rangeKey] || 0;
      const placedStudentsCount = new Set(rangeOffers.map((offer) => offer.studentId)).size;
      const placementPercentage = (placedStudentsCount / registeredStudentsCount) * 100 || 0;
      const unplacedPercentage = 100 - placementPercentage;

      const ctcArray = rangeOffers
        .filter(
          (offer) =>
            (offer?.salary?.job?.season?.type === SeasonTypeEnum.PLACEMENT && offer?.salary?.totalCTC !== null) ||
            (offer?.salary?.job?.season?.type === SeasonTypeEnum.INTERN && offer?.salary?.stipend !== null)
        )
        .map((offer) => (offer.salary.totalCTC !== null ? offer.salary.totalCTC : offer.salary.stipend));

      const stats = this.calculateStatistics(ctcArray);
      statistics.academicWiseStats[rangeKey] = {
        totalRegisteredStudentsCount: registeredStudentsCount,
        placedStudentsCount: placedStudentsCount,
        placementPercentage: placementPercentage,
        unplacedPercentage: unplacedPercentage,
        ...stats,
        totalOffers: rangeOffers.length,
        totalCompaniesOffering: new Set(rangeOffers.map((offer) => offer.salary.job.companyId)).size,
      };
    });

    return statistics.academicWiseStats;
  }

  async getSeasonStats(seasonId: string) {
    const overallStats = await this.getStatsOverall(seasonId);
    const courseWiseStats = await this.getStatsCourseWise(seasonId);
    const departmentWiseStats = await this.getStatsDepartmentWise(seasonId);
    const categoryWiseStats = await this.getStatsCategoryWise(seasonId);
    const genderWiseStats = await this.getStatsGenderWise(seasonId);
    const academicWiseStats = await this.getStatsAcademicWise(seasonId);
    const academicWiseStats = await this.getStatsAcademicWise(seasonId);

    return {
      overallStats,
      courseWiseStats,
      departmentWiseStats,
      categoryWiseStats,
      genderWiseStats,
      academicWiseStats,
      academicWiseStats,
    };
  }

  async getCumulativeStatsOverall(seasonIds: string[]) {
    const totalRegisteredStudentsCount = await this.registrationsRepo.count({
      col: "studentId",
      distinct: true,
      where: { seasonId: { [Op.in]: seasonIds }, registered: true },
    });

    const offers = await this.onCampusRepo.findAll({
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
              where: {
                seasonId: { [Op.in]: seasonIds },
              },
            },
          ],
        },
      ],
    });

    const studentIdsSet = new Set();
    const companyIds = new Set();
    const ctcArray = [];

    offers.forEach((offer) => {
      if (offer.studentId) {
        studentIdsSet.add(offer.studentId);
      }
      if (offer.salary && offer.salary.job) {
        companyIds.add(offer.salary.job.companyId);
      }
      if (offer.salary && offer.salary.totalCTC !== null) {
        ctcArray.push(offer.salary.totalCTC);
      }
    });

    const statistics = this.calculateStatistics(ctcArray);
    const totalCompaniesOffering = companyIds.size;
    const totalOffers = offers.length;
    const placedStudentsCount = studentIdsSet.size;
    const placementPercentage =
      totalRegisteredStudentsCount === 0 ? 0 : (placedStudentsCount / totalRegisteredStudentsCount) * 100;
    const unplacedPercentage = 100 - placementPercentage;

    return {
      totalRegisteredStudentsCount,
      placedStudentsCount,
      placementPercentage,
      unplacedPercentage,
      totalOffers,
      totalCompaniesOffering,
      ...statistics,
    };
  }

  async getCumulativeStatsCourseWise(seasonIds: string[]) {
    const programs = await this.programRepo.findAll({
      attributes: ["course"],
      group: ["course"],
    });
    const courses = programs.map((program) => program.course);

    const registrations = await this.registrationsRepo.findAll({
      where: { seasonId: { [Op.in]: seasonIds }, registered: true },
      include: [
        {
          model: StudentModel,
          as: "student",
          include: [{ model: ProgramModel, as: "program" }],
        },
      ],
    });

    const registeredStudents = registrations.map((registration) => registration.student);
    const courseWiseRegisteredCount = {};

    registeredStudents.forEach((student) => {
      const courseId = student.program.course;
      courseWiseRegisteredCount[courseId] = (courseWiseRegisteredCount[courseId] || 0) + 1;
    });

    const offers = await this.onCampusRepo.findAll({
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
              where: { seasonId: { [Op.in]: seasonIds } },
            },
          ],
        },
        {
          model: StudentModel,
          as: "student",
          include: [{ model: ProgramModel, as: "program" }],
        },
      ],
    });

    const statistics = { courseWiseStats: {} };
    const courseOffersMap = {};

    offers.forEach((offer) => {
      const courseId = offer.student.program.course;
      courseOffersMap[courseId] = courseOffersMap[courseId] || [];
      courseOffersMap[courseId].push(offer);
    });

    courses.forEach((course) => {
      const courseId = course;
      const courseOffers = courseOffersMap[courseId] || [];
      const registeredCount = courseWiseRegisteredCount[courseId] || 0;
      const placedCount = new Set(courseOffers.map((offer) => offer.studentId)).size;
      const placementPercentage = (placedCount / registeredCount) * 100 || 0;
      const unplacedPercentage = 100 - placementPercentage;

      const ctcArray = courseOffers.map((offer) => offer.salary?.totalCTC).filter((ctc) => ctc !== null);

      const stats = this.calculateStatistics(ctcArray);

      statistics.courseWiseStats[courseId] = {
        totalRegisteredStudentsCount: registeredCount,
        placedStudentsCount: placedCount,
        placementPercentage,
        unplacedPercentage,
        ...stats,
        totalOffers: courseOffers.length,
        totalCompaniesOffering: new Set(courseOffers.map((offer) => offer.salary.job.companyId)).size,
      };
    });

    return statistics.courseWiseStats;
  }

  async getCumulativeStatsDepartmentWise(seasonIds: string[]) {
    const programs = await this.programRepo.findAll({
      attributes: ["department"],
      group: ["department"],
    });
    const departments = programs.map((program) => program.department);

    const registrations = await this.registrationsRepo.findAll({
      where: { seasonId: { [Op.in]: seasonIds }, registered: true },
      include: [
        {
          model: StudentModel,
          as: "student",
          include: [{ model: ProgramModel, as: "program" }],
        },
      ],
    });

    const registeredStudents = registrations.map((registration) => registration.student);
    const departmentWiseRegisteredCount = {};

    registeredStudents.forEach((student) => {
      const departmentId = student.program.department;
      departmentWiseRegisteredCount[departmentId] = (departmentWiseRegisteredCount[departmentId] || 0) + 1;
    });

    const offers = await this.onCampusRepo.findAll({
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
              where: { seasonId: { [Op.in]: seasonIds } },
            },
          ],
        },
        {
          model: StudentModel,
          as: "student",
          include: [{ model: ProgramModel, as: "program" }],
        },
      ],
    });

    const statistics = { departmentWiseStats: {} };
    const departmentOffersMap = {};

    offers.forEach((offer) => {
      const departmentId = offer.student.program.department;
      departmentOffersMap[departmentId] = departmentOffersMap[departmentId] || [];
      departmentOffersMap[departmentId].push(offer);
    });

    departments.forEach((department) => {
      const departmentId = department;
      const departmentOffers = departmentOffersMap[departmentId] || [];
      const registeredCount = departmentWiseRegisteredCount[departmentId] || 0;
      const placedCount = new Set(departmentOffers.map((offer) => offer.studentId)).size;
      const placementPercentage = (placedCount / registeredCount) * 100 || 0;
      const unplacedPercentage = 100 - placementPercentage;

      const ctcArray = departmentOffers.map((offer) => offer.salary?.totalCTC).filter((ctc) => ctc !== null);

      const stats = this.calculateStatistics(ctcArray);

      statistics.departmentWiseStats[departmentId] = {
        totalRegisteredStudentsCount: registeredCount,
        placedStudentsCount: placedCount,
        placementPercentage,
        unplacedPercentage,
        ...stats,
        totalOffers: departmentOffers.length,
        totalCompaniesOffering: new Set(departmentOffers.map((offer) => offer.salary.job.companyId)).size,
      };
    });

    return statistics.departmentWiseStats;
  }
  async getCumulativeStatsCategoryWise(seasonIds: string[]) {
    const categories = Object.keys(CategoryEnum).map((key) => CategoryEnum[key]);

    const registrations = await this.registrationsRepo.findAll({
      where: { seasonId: { [Op.in]: seasonIds }, registered: true },
      include: [
        {
          model: StudentModel,
          as: "student",
        },
      ],
    });

    const registeredStudents = registrations.map((registration) => registration.student);
    const categoryWiseRegisteredCount: Record<string, number> = {};

    registeredStudents.forEach((student) => {
      const categoryId = student.category;
      categoryWiseRegisteredCount[categoryId] = (categoryWiseRegisteredCount[categoryId] || 0) + 1;
    });

    const offers = await this.onCampusRepo.findAll({
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
              where: {
                seasonId: { [Op.in]: seasonIds },
              },
            },
          ],
        },
        {
          model: StudentModel,
          as: "student",
        },
      ],
    });

    const statistics = {
      categoryWiseStats: {},
    };

    const categoryOffersMap = {};

    offers.forEach((offer) => {
      const categoryId = offer.student.category;
      categoryOffersMap[categoryId] = categoryOffersMap[categoryId] || [];
      categoryOffersMap[categoryId].push(offer);
    });

    categories.forEach((category) => {
      const categoryId = category;
      const categoryOffers = categoryOffersMap[categoryId] || [];
      const categoryRegisteredStudentsCount = categoryWiseRegisteredCount[categoryId] || 0;
      const categoryPlacedStudentsCount = new Set(categoryOffers.map((offer) => offer.studentId)).size;
      const placementPercentage = (categoryPlacedStudentsCount / categoryRegisteredStudentsCount) * 100 || 0;
      const unplacedPercentage = 100 - placementPercentage;
      const ctcArray = categoryOffers.map((offer) => offer.salary?.totalCTC || 0).filter((ctc) => ctc !== null);

      const stats = this.calculateStatistics(ctcArray);

      statistics[categoryId] = {
        totalRegisteredStudentsCount: categoryRegisteredStudentsCount,
        placedStudentsCount: categoryPlacedStudentsCount,
        placementPercentage: placementPercentage,
        unplacedPercentage: unplacedPercentage,
        ...stats,
        totalOffers: categoryOffers.length,
        totalCompaniesOffering: new Set(categoryOffers.map((offer) => offer.salary.job.companyId)).size,
      };
    });

    return statistics;
  }

  async getCumulativeStatsGenderWise(seasonIds: string[]) {
    const genders = Object.keys(GenderEnum).map((key) => GenderEnum[key]);

    const registrations = await this.registrationsRepo.findAll({
      where: { seasonId: { [Op.in]: seasonIds }, registered: true },
      include: [
        {
          model: StudentModel,
          as: "student",
        },
      ],
    });

    const registeredStudents = registrations.map((registration) => registration.student);
    const genderWiseRegisteredCount: Record<string, number> = {};

    registeredStudents.forEach((student) => {
      const genderId = student.gender;
      genderWiseRegisteredCount[genderId] = (genderWiseRegisteredCount[genderId] || 0) + 1;
    });

    const offers = await this.onCampusRepo.findAll({
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
              where: {
                seasonId: { [Op.in]: seasonIds },
              },
            },
          ],
        },
        {
          model: StudentModel,
          as: "student",
        },
      ],
    });

    const statistics = {
      genderWiseStats: {},
    };

    const genderOffersMap = {};

    offers.forEach((offer) => {
      const genderId = offer.student.gender;
      genderOffersMap[genderId] = genderOffersMap[genderId] || [];
      genderOffersMap[genderId].push(offer);
    });

    genders.forEach((gender) => {
      const genderId = gender;
      const genderOffers = genderOffersMap[genderId] || [];
      const genderRegisteredStudentsCount = genderWiseRegisteredCount[genderId] || 0;
      const genderPlacedStudentsCount = new Set(genderOffers.map((offer) => offer.studentId)).size;
      const placementPercentage = (genderPlacedStudentsCount / genderRegisteredStudentsCount) * 100 || 0;
      const unplacedPercentage = 100 - placementPercentage;

      const ctcArray = genderOffers.map((offer) => offer.salary?.totalCTC || 0).filter((ctc) => ctc !== null);

      const stats = this.calculateStatistics(ctcArray);

      statistics[genderId] = {
        totalRegisteredStudentsCount: genderRegisteredStudentsCount,
        placedStudentsCount: genderPlacedStudentsCount,
        placementPercentage: placementPercentage,
        unplacedPercentage: unplacedPercentage,
        ...stats,
        totalOffers: genderOffers.length,
        totalCompaniesOffering: new Set(genderOffers.map((offer) => offer.salary.job.companyId)).size,
      };
    });

    return statistics;
  }
}
