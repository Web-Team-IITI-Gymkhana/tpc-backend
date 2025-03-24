import { NestedNumber, NestedObject } from "src/decorators/dto";

export class StatsDto {
  @NestedNumber({})
  totalRegisteredStudentsCount: number;

  @NestedNumber({})
  placedStudentsCount: number;

  @NestedNumber({})
  placementPercentage: number;

  @NestedNumber({})
  unplacedPercentage: number;

  @NestedNumber({})
  totalOffers: number;

  @NestedNumber({})
  totalCompaniesOffering: number;

  @NestedNumber({})
  highestPackage: number;

  @NestedNumber({})
  lowestPackage: number;

  @NestedNumber({})
  meanPackage: number;

  @NestedNumber({})
  medianPackage: number;

  @NestedNumber({})
  modePackage: number;
}
export class DepartmentWiseStatsDto {
  @NestedObject({ type: StatsDto })
  "Astronomy, Astrophysics and Space Engineering": StatsDto;

  @NestedObject({ type: StatsDto })
  "Biosciences and Biomedical Engineering": StatsDto;

  @NestedObject({ type: StatsDto })
  "Chemistry": StatsDto;

  @NestedObject({ type: StatsDto })
  "Civil Engineering": StatsDto;

  @NestedObject({ type: StatsDto })
  "Computer Science and Engineering": StatsDto;

  @NestedObject({ type: StatsDto })
  "Electrical Engineering": StatsDto;

  @NestedObject({ type: StatsDto })
  "Humanities and Social Sciences": StatsDto;

  @NestedObject({ type: StatsDto })
  "Mathematics": StatsDto;

  @NestedObject({ type: StatsDto })
  "Mechanical Engineering": StatsDto;

  @NestedObject({ type: StatsDto })
  "Metallurgical Engineering and Materials Science": StatsDto;

  @NestedObject({ type: StatsDto })
  "Physics": StatsDto;
}
export class CategoryWiseStatsDto {
  @NestedObject({ type: StatsDto })
  GENERAL: StatsDto;

  @NestedObject({ type: StatsDto })
  OBC: StatsDto;

  @NestedObject({ type: StatsDto })
  SC: StatsDto;

  @NestedObject({ type: StatsDto })
  ST: StatsDto;

  @NestedObject({ type: StatsDto })
  PWD: StatsDto;
}
export class GenderWiseStatsDto {
  @NestedObject({ type: StatsDto })
  MALE: StatsDto;

  @NestedObject({ type: StatsDto })
  FEMALE: StatsDto;

  @NestedObject({ type: StatsDto })
  OTHER: StatsDto;
}

export class CourseWiseStatsDto {
  @NestedObject({ type: StatsDto })
  PhD: StatsDto;

  @NestedObject({ type: StatsDto })
  MTech: StatsDto;

  @NestedObject({ type: StatsDto })
  BTech: StatsDto;

  @NestedObject({ type: StatsDto })
  MSc: StatsDto;

  @NestedObject({ type: StatsDto })
  MS_Research: StatsDto;

  @NestedObject({ type: StatsDto })
  BTech_MTech: StatsDto;
}

export class AcademicWiseStatsDto {
  @NestedObject({ type: StatsDto })
  "0-1": StatsDto;

  @NestedObject({ type: StatsDto })
  "1-2": StatsDto;

  @NestedObject({ type: StatsDto })
  "2-3": StatsDto;

  @NestedObject({ type: StatsDto })
  "3-4": StatsDto;

  @NestedObject({ type: StatsDto })
  "4-5": StatsDto;

  @NestedObject({ type: StatsDto })
  "5-6": StatsDto;

  @NestedObject({ type: StatsDto })
  "6-7": StatsDto;

  @NestedObject({ type: StatsDto })
  "7-8": StatsDto;

  @NestedObject({ type: StatsDto })
  "8-9": StatsDto;

  @NestedObject({ type: StatsDto })
  "9-10": StatsDto;
}
export class SeasonStatsDto {
  @NestedObject({ type: StatsDto })
  overallStats: StatsDto;

  @NestedObject({ type: DepartmentWiseStatsDto })
  departmentWiseStats: DepartmentWiseStatsDto;

  @NestedObject({ type: CategoryWiseStatsDto })
  categoryWiseStats: CategoryWiseStatsDto;

  @NestedObject({ type: GenderWiseStatsDto })
  genderWiseStats: GenderWiseStatsDto;

  @NestedObject({ type: CourseWiseStatsDto })
  courseWiseStats: CourseWiseStatsDto;

  @NestedObject({ type: AcademicWiseStatsDto })
  academicWiseStats: AcademicWiseStatsDto;
}
