import {
  CategoryEnum,
  CompanyCategoryEnum,
  EventTypeEnum,
  GenderEnum,
  JobStatusTypeEnum,
  RoleEnum,
  SeasonTypeEnum,
  TpcMemberRoleEnum,
  IndustryDomainEnum,
  CountriesEnum,
  BacklogEnum,
} from "src/enums";
import { faker } from "@faker-js/faker";
import { AddressDto } from "src/job/dtos/jaf.dto";
import {
  ApplicationModel,
  CompanyModel,
  EventModel,
  FacultyApprovalRequestModel,
  FacultyModel,
  JobCoordinatorModel,
  JobModel,
  OffCampusOfferModel,
  OnCampusOfferModel,
  PenaltyModel,
  ProgramModel,
  RecruiterModel,
  ResumeModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  TpcMemberModel,
  UserModel,
} from "src/db/models";
import { Optional } from "sequelize";
import { NullishPropertiesOf } from "sequelize/types/utils";
import { floor } from "lodash";
import { allCourses, MAX_INT, YEARS } from "src/constants";
import {
  DepartmentEnum,
  FacultyApprovalStatusEnum,
  InterviewTypesEnum,
  JobCoordinatorRoleEnum,
  OfferStatusEnum,
  SelectionModeEnum,
  TestTypesEnum,
} from "src/enums";
import { RegistrationModel } from "src/db/models/RegistrationModel";
import { InterviewExperienceModel } from "src/db/models/InterviewExperienceModel";
import { SeasonStatusEnum } from "src/enums/SeasonStatus.enum";
import { JobRegistrationEnum } from "src/enums/jobRegistration.enum";

export const SEASONS: Optional<SeasonModel, NullishPropertiesOf<SeasonModel>>[] = Array.from({ length: 5 }, () => ({
  id: faker.string.uuid(),
  year: faker.string.numeric({ length: 4, allowLeadingZeros: false }),
  status: faker.helpers.enumValue(SeasonStatusEnum),
  type: faker.helpers.enumValue(SeasonTypeEnum),
}));

const ADDRESSES: AddressDto[] = Array.from({ length: 5 }, () => ({
  line1: faker.location.streetAddress(),
  line2: faker.datatype.boolean() ? faker.location.secondaryAddress() : undefined,
  city: faker.location.city(),
  state: faker.location.state(),
  zipCode: faker.location.zipCode(),
  country: faker.helpers.enumValue(CountriesEnum),
}));

export const COMPANIES: Optional<CompanyModel, NullishPropertiesOf<CompanyModel>>[] = Array.from(
  { length: 5 },
  (_, idx) => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    website: faker.datatype.boolean() ? faker.internet.url() : undefined,
    domains: Array.from({ length: idx }, () => faker.helpers.enumValue(IndustryDomainEnum)),
    category: faker.helpers.enumValue(CompanyCategoryEnum),
    address: ADDRESSES[idx],
    size: faker.datatype.boolean() ? faker.number.int({ max: MAX_INT }) : undefined,
    yearOfEstablishment: String(faker.date.anytime().getFullYear()),
    annualTurnover: faker.datatype.boolean() ? String(faker.number.int()) : undefined,
    socialMediaLink: faker.datatype.boolean() ? faker.internet.url() : undefined,
  })
);

export const PROGRAMS: Optional<ProgramModel, NullishPropertiesOf<ProgramModel>>[] = YEARS.flatMap((year) =>
  allCourses.map((course) => ({ year, ...course, id: faker.string.uuid() }))
);

export const USERS: Optional<UserModel, NullishPropertiesOf<UserModel>>[] = Array.from({ length: 25 }, (_, idx) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: faker.string.uuid(),
    name: firstName + " " + lastName,
    email: faker.internet.email({ firstName: firstName, lastName: lastName }),
    contact:
      faker.string.numeric({ length: 2, allowLeadingZeros: false }) +
      " " +
      faker.string.numeric({ length: 10, allowLeadingZeros: false }),
    role: Object.values(RoleEnum)[floor(idx / 5)],
  };
});

export const DEPARTMENTS = faker.helpers.arrayElements(Object.values(DepartmentEnum), 5);

export const FACULTIES: Optional<FacultyModel, NullishPropertiesOf<FacultyModel>>[] = Array.from(
  { length: 5 },
  (_, idx) => ({
    id: faker.string.uuid(),
    userId: USERS[20 + idx].id,
    department: DEPARTMENTS[idx],
  })
);

export const STUDENTS: Optional<StudentModel, NullishPropertiesOf<StudentModel>>[] = Array.from(
  { length: 5 },
  (_, idx) => ({
    id: faker.string.uuid(),
    userId: USERS[idx].id,
    tenthMarks: faker.number.float({ min: 6, max: 10 }),
    twelthMarks: faker.number.float({ min: 6, max: 10 }),
    rollNo: faker.string.numeric({ length: 9, allowLeadingZeros: false }),
    category: faker.helpers.enumValue(CategoryEnum),
    gender: faker.helpers.enumValue(GenderEnum),
    cpi: faker.number.float({ min: 6, max: 10 }),
    programId: faker.helpers.arrayElement(PROGRAMS).id,
  })
);

export const TPC_MEMBERS: Optional<TpcMemberModel, NullishPropertiesOf<TpcMemberModel>>[] = STUDENTS.slice(0, 3).map(
  (student) => ({
    id: faker.string.uuid(),
    role: faker.helpers.enumValue(TpcMemberRoleEnum),
    studentId: student.id,
  })
);

export const RECRUITERS: Optional<RecruiterModel, NullishPropertiesOf<RecruiterModel>>[] = Array.from(
  {
    length: 5,
  },
  (_, idx) => ({
    id: faker.string.uuid(),
    userId: USERS[5 + idx].id,
    companyId: faker.helpers.arrayElement(COMPANIES).id,
    designation: faker.string.alpha(),
    landline: faker.datatype.boolean() ? faker.string.numeric({ length: 7 }) : undefined,
  })
);

export const RESUMES: Optional<ResumeModel, NullishPropertiesOf<ResumeModel>>[] = STUDENTS.flatMap((student) => {
  const noOfResumes = faker.number.int({ min: 1, max: 4 });

  return Array.from({ length: noOfResumes }, (_, idx) => ({
    id: faker.string.uuid(),
    studentId: student.id,
    filepath: faker.string.uuid() + ".pdf",
    name: faker.string.alpha(),
    verified: faker.datatype.boolean(),
  }));
});

export const SELECTION_PROCEDURES = Array.from({ length: 5 }, (_, idx) => ({
  selectionMode: faker.helpers.enumValue(SelectionModeEnum),
  shortlistFromResume: faker.datatype.boolean(),
  groupDiscussion: faker.datatype.boolean(),
  tests: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
    type: faker.helpers.enumValue(TestTypesEnum),
    duration: faker.number.int({ min: 0, max: MAX_INT }),
  })),
  interviews: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
    type: faker.helpers.enumValue(InterviewTypesEnum),
    duration: faker.number.int({ min: 0, max: MAX_INT }),
  })),
  requirements: {
    numberOfMembers: faker.datatype.boolean() ? faker.number.int({ min: 0, max: MAX_INT }) : undefined,
    numberOfRooms: faker.datatype.boolean() ? faker.number.int({ min: 0, max: MAX_INT }) : undefined,
    otherRequirements: faker.datatype.boolean() ? faker.string.alpha() : undefined,
  },
  others: faker.datatype.boolean() ? faker.string.alpha() : undefined,
}));

export const COMPANIES_DETAILS_FILLED = Array.from({ length: 5 }, (_, idx) => ({
  name: faker.company.name(),
  website: faker.datatype.boolean() ? faker.internet.url() : undefined,
  domains: Array.from({ length: idx }, () => faker.helpers.enumValue(IndustryDomainEnum)),
  category: faker.helpers.enumValue(CompanyCategoryEnum),
  address: ADDRESSES[idx],
  size: faker.datatype.boolean() ? faker.number.int({ max: MAX_INT }) : undefined,
  yearOfEstablishment: String(faker.date.anytime().getFullYear()),
  annualTurnover: faker.datatype.boolean() ? String(faker.number.int()) : undefined,
  socialMediaLink: faker.datatype.boolean() ? faker.internet.url() : undefined,
}));

export const RECRUITERS_DETAILS_FILLED = Array.from({ length: 5 }, (_, idx) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    name: firstName + " " + lastName,
    email: faker.internet.email({ firstName: firstName, lastName: lastName }),
    designation: faker.person.jobTitle(),
    contact: String(faker.phone.number()),
    landline: faker.datatype.boolean() ? faker.string.numeric({ length: 7 }) : undefined,
  };
});

export const JOBS: Optional<JobModel, NullishPropertiesOf<JobModel>>[] = Array.from({ length: 5 }, (_, idx) => ({
  id: faker.string.uuid(),
  seasonId: faker.helpers.arrayElement(SEASONS).id,
  recruiterId: faker.helpers.arrayElement(RECRUITERS).id,
  companyId: faker.helpers.arrayElement(COMPANIES).id,
  role: faker.person.jobTitle(),
  others: faker.datatype.boolean() ? faker.string.alpha() : undefined,
  active: faker.datatype.boolean(),
  currentStatus: faker.helpers.enumValue(JobStatusTypeEnum),
  registration: faker.helpers.enumValue(JobRegistrationEnum),
  companyDetailsFilled: COMPANIES_DETAILS_FILLED[idx],
  recruiterDetailsFilled: RECRUITERS_DETAILS_FILLED[idx],
  selectionProcedure: SELECTION_PROCEDURES[idx],
  description: faker.datatype.boolean() ? faker.string.alpha() : undefined,
  attachments: faker.datatype.boolean()
    ? Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.string.uuid() + ".pdf")
    : undefined,
  location: faker.string.alpha(),
  medicalRequirements: faker.string.alpha(),
  additionalInfo: faker.string.alpha(),
  minNoOfHires: faker.datatype.boolean() ? faker.number.int({ min: 0, max: MAX_INT }) : undefined,
  expectedNoOfHires: faker.datatype.boolean() ? faker.number.int({ min: 0, max: MAX_INT }) : undefined,
  offerLetterReleaseDate: faker.datatype.boolean() ? faker.date.anytime() : undefined,
  joiningDate: faker.datatype.boolean() ? faker.date.anytime() : undefined,
  duration: faker.string.alpha(),
}));

function makeCriteria() {
  const programs = faker.helpers.arrayElements(PROGRAMS, { min: 1, max: 5 });

  const ans = {
    programs: programs.map((program) => program.id),
    genders: faker.helpers.arrayElements(Object.values(GenderEnum), { min: 1, max: 3 }),
    categories: faker.helpers.arrayElements(Object.values(CategoryEnum), { min: 1, max: 5 }),
    minCPI: faker.datatype.boolean ? faker.number.float({ min: 0, max: 10 }) : undefined,
    isBacklogAllowed: faker.helpers.enumValue(BacklogEnum),
    tenthMarks: faker.datatype.boolean ? faker.number.float({ min: 0, max: 10 }) : undefined,
    twelthMarks: faker.datatype.boolean ? faker.number.float({ min: 0, max: 10 }) : undefined,
    facultyApprovals: [
      ...new Set(
        faker.helpers.arrayElements(programs, { min: 0, max: programs.length }).map((program) => program.department)
      ),
    ],
  };

  return ans;
}

export const SALARIES: Optional<SalaryModel, NullishPropertiesOf<SalaryModel>>[] = JOBS.flatMap((job) =>
  Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => ({
    id: faker.string.uuid(),
    jobId: job.id,
    salaryPeriod: faker.datatype.boolean() ? faker.string.alpha() : undefined,
    others: faker.datatype.boolean() ? faker.string.alpha() : undefined,
    baseSalary: faker.number.int({ min: 0, max: 200000 }),
    totalCTC: faker.number.int({ min: 0, max: 200000 }),
    takeHomeSalary: faker.number.int({ min: 0, max: 200000 }),
    foreignCurrencyCTC: faker.number.int({ min: 0, max: 200000 }),
    joiningBonus: faker.number.int({ min: 0, max: 200000 }),
    performanceBonus: faker.number.int({ min: 0, max: 200000 }),
    relocation: faker.number.int({ min: 0, max: 200000 }),
    bondAmount: faker.number.int({ min: 0, max: 200000 }),
    esopAmount: faker.number.int({ min: 0, max: 200000 }),
    firstYearCTC: faker.number.int({ min: 0, max: 200000 }),
    medicalAllowance: faker.number.int({ min: 0, max: 200000 }),
    retentionBonus: faker.number.int({ min: 0, max: 200000 }),
    deductions: faker.number.int({ min: 0, max: 200000 }),
    stipend: faker.number.int({ min: 0, max: 200000 }),
    foreignCurrencyStipend: faker.string.alpha(),
    accomodation: faker.number.int({ min: 0, max: 200000 }),
    tenetativeCTC: faker.number.int({ min: 0, max: 200000 }),
    foreignCurrencyCode: faker.string.alpha(),
    esopVestPeriod: faker.string.alpha(),
    bondDuration: faker.string.alpha(),
    PPOConfirmationDate: faker.datatype.boolean() ? faker.date.anytime() : undefined,
    grossSalary: faker.number.int({ min: 0, max: 200000 }),
    otherCompensations: faker.number.int({ min: 0, max: 200000 }),
    ...makeCriteria(),
  }))
);

export const PENALTIES: Optional<PenaltyModel, NullishPropertiesOf<PenaltyModel>>[] = STUDENTS.flatMap((student) =>
  Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
    id: faker.string.uuid(),
    studentId: student.id,
    penalty: faker.number.int({ min: 5, max: 35 }),
    reason: faker.lorem.sentence(),
  }))
);

const offers = {
  0: [0, 0],
  1: [0, 1],
  2: [1, 0],
  3: [1, 1],
  4: [2, 2],
};

export const ON_CAMPUS_OFFERS: Optional<OnCampusOfferModel, NullishPropertiesOf<OnCampusOfferModel>>[] =
  STUDENTS.flatMap((student, idx) => {
    const numOffers = offers[idx][0];

    return Array.from({ length: numOffers }, () => ({
      id: faker.string.uuid(),
      studentId: student.id,
      salaryId: faker.helpers.arrayElement(SALARIES).id,
      status: faker.helpers.enumValue(OfferStatusEnum),
    }));
  });

export const OFF_CAMPUS_OFFERS: Optional<OffCampusOfferModel, NullishPropertiesOf<OffCampusOfferModel>>[] =
  STUDENTS.flatMap((student, idx) => {
    const numOffers = offers[idx][1];
    const season = faker.helpers.arrayElement(SEASONS);

    return Array.from({ length: numOffers }, () => ({
      id: faker.string.uuid(),
      studentId: student.id,
      seasonId: season.id,
      companyId: faker.helpers.arrayElement(COMPANIES).id,
      salary: faker.number.int({ min: 0, max: 200000 }),
      salaryPeriod:
        season.type === SeasonTypeEnum.INTERN
          ? String(faker.number.int({ min: 1, max: 3 })) + " " + "Months"
          : undefined,
      metadata: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
      role: faker.person.jobTitle(),
      status: faker.helpers.enumValue(OfferStatusEnum),
    }));
  });

export const JOB_COORDINATORS: Optional<JobCoordinatorModel, NullishPropertiesOf<JobCoordinatorModel>>[] = JOBS.flatMap(
  (job) =>
    TPC_MEMBERS.map((tpcMember) => ({
      id: faker.string.uuid(),
      jobId: job.id,
      tpcMemberId: tpcMember.id,
      role: faker.helpers.enumValue(JobCoordinatorRoleEnum),
    }))
);

export const FACULTY_APPROVAL_REQUESTS: Optional<
  FacultyApprovalRequestModel,
  NullishPropertiesOf<FacultyApprovalRequestModel>
>[] = SALARIES.flatMap((salary) =>
  FACULTIES.map(
    (faculty): Optional<FacultyApprovalRequestModel, NullishPropertiesOf<FacultyApprovalRequestModel>> => ({
      id: faker.string.uuid(),
      salaryId: salary.id,
      facultyId: faculty.id,
      status: faker.helpers.enumValue(FacultyApprovalStatusEnum),
      remarks: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
    })
  )
);

export const EVENTS: Optional<EventModel, NullishPropertiesOf<EventModel>>[] = JOBS.flatMap((job) =>
  Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, (_, idx) => ({
    id: faker.string.uuid(),
    jobId: job.id,
    roundNumber: idx + 1,
    type: faker.helpers.enumValue(EventTypeEnum),
    metadata: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
    startDateTime: faker.date.recent(),
    endDateTime: faker.date.recent(),
  }))
);

export const APPLICATIONS: Optional<ApplicationModel, NullishPropertiesOf<ApplicationModel>>[] = JOBS.flatMap((job) =>
  STUDENTS.map((student) => ({
    id: faker.string.uuid(),
    eventId: faker.helpers.arrayElement(EVENTS.filter((event) => event.jobId === job.id)).id,
    jobId: job.id,
    studentId: student.id,
    resumeId: faker.helpers.arrayElement(RESUMES.filter((resume) => resume.studentId === student.id)).id,
  }))
);

export const REGISTRATIONS: Optional<RegistrationModel, NullishPropertiesOf<RegistrationModel>>[] = STUDENTS.flatMap(
  (student) =>
    SEASONS.map((season) => ({
      id: faker.string.uuid(),
      seasonId: season.id,
      studentId: student.id,
      registered: faker.datatype.boolean(),
    }))
);

export const INTERVIEW_EXPERIENCES: Optional<
  InterviewExperienceModel,
  NullishPropertiesOf<InterviewExperienceModel>
>[] = APPLICATIONS.map((application) => {
  const student = STUDENTS.filter((data) => data.id === application.studentId)[0];
  const user = USERS.filter((data) => data.id === student.userId)[0];
  const job = JOBS.filter((data) => data.id === application.jobId)[0];

  const ans: Optional<InterviewExperienceModel, NullishPropertiesOf<InterviewExperienceModel>> = {
    id: faker.string.uuid(),
    studentName: user.name,
    seasonId: job.seasonId,
    companyId: job.companyId,
    filename: faker.string.uuid() + ".pdf",
  };

  return ans;
});
