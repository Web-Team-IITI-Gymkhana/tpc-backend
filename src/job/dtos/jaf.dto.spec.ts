/**
 * @file jaf.dto.spec.ts
 *
 * Comprehensive unit tests for every DTO class defined in jaf.dto.ts.
 * Tests use plainToInstance + validate (the same pipeline that NestJS
 * ValidationPipe runs) so they catch real runtime failures.
 *
 * Suites:
 *  1. AddressDto
 *  2. RecruiterFilledDto
 *  3. SelectionProcedureDto  ← includes the selectionMode coercion fix
 *  4. SalaryDto
 *  5. JafDto (full end-to-end payload)
 */

import "reflect-metadata";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { v4 as uuid } from "uuid";

import {
  AddressDto,
  JafDto,
  RecruiterFilledDto,
  SelectionProcedureDto,
} from "./jaf.dto";

import {
  BacklogEnum,
  CategoryEnum,
  CompanyCategoryEnum,
  CountriesEnum,
  GenderEnum,
  IndustryDomainEnum,
  InterviewTypesEnum,
  SelectionModeEnum,
  TestTypesEnum,
} from "src/enums";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function transform<T>(cls: new () => T, plain: object): Promise<{ instance: T; errors: ReturnType<typeof validate> extends Promise<infer E> ? E : never }> {
  const instance = plainToInstance(cls, plain) as T;
  const errors = await validate(instance as object);
  return { instance, errors } as any;
}

function errorFields(errors: any[]): string[] {
  return errors.map((e) => e.property);
}

// ─────────────────────────────────────────────────────────────────────────────
// Seed objects (valid minimal payloads for each DTO)
// ─────────────────────────────────────────────────────────────────────────────

const VALID_ADDRESS = {
  line1: "123 Main St",
  city: "Indore",
  state: "Madhya Pradesh",
  country: CountriesEnum.IND,
};

const VALID_RECRUITER = {
  name: "Jane Doe",
  email: "jane@company.com",
  contact: "+911234567890",
  designation: "HR Manager",
};

const VALID_SELECTION_PROCEDURE = {
  shortlistFromResume: true,
  groupDiscussion: false,
  tests: [],
  interviews: [],
};

const VALID_SALARY = {};   // all fields optional in SalaryDto

const VALID_JOB = {
  seasonId: uuid(),
  role: "Software Engineer",
  recruiterDetailsFilled: [VALID_RECRUITER],
  selectionProcedure: VALID_SELECTION_PROCEDURE,
};

const VALID_JAF = {
  job: VALID_JOB,
  salaries: [VALID_SALARY],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. AddressDto
// ─────────────────────────────────────────────────────────────────────────────

describe("AddressDto", () => {
  it("accepts a fully valid address", async () => {
    const { errors } = await transform(AddressDto, VALID_ADDRESS);
    expect(errors).toHaveLength(0);
  });

  it("accepts optional line2", async () => {
    const { errors } = await transform(AddressDto, { ...VALID_ADDRESS, line2: "Apt 4B" });
    expect(errors).toHaveLength(0);
  });

  it.each(["line1", "city", "state", "country"] as const)(
    "rejects when required field '%s' is missing",
    async (field) => {
      const payload = { ...VALID_ADDRESS };
      delete (payload as any)[field];
      const { errors } = await transform(AddressDto, payload);
      expect(errorFields(errors)).toContain(field);
    }
  );

  it("rejects an invalid country value", async () => {
    const { errors } = await transform(AddressDto, { ...VALID_ADDRESS, country: "MARS" });
    expect(errorFields(errors)).toContain("country");
  });

  it.each(Object.values(CountriesEnum).slice(0, 5))(
    "accepts valid country '%s'",
    async (country) => {
      const { errors } = await transform(AddressDto, { ...VALID_ADDRESS, country });
      expect(errors).toHaveLength(0);
    }
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. RecruiterFilledDto
// ─────────────────────────────────────────────────────────────────────────────

describe("RecruiterFilledDto", () => {
  it("accepts a fully valid recruiter", async () => {
    const { errors } = await transform(RecruiterFilledDto, VALID_RECRUITER);
    expect(errors).toHaveLength(0);
  });

  it("accepts optional landline", async () => {
    const { errors } = await transform(RecruiterFilledDto, { ...VALID_RECRUITER, landline: "0731-1234567" });
    expect(errors).toHaveLength(0);
  });

  it.each(["name", "email", "contact", "designation"] as const)(
    "rejects when required field '%s' is missing",
    async (field) => {
      const payload = { ...VALID_RECRUITER };
      delete (payload as any)[field];
      const { errors } = await transform(RecruiterFilledDto, payload);
      expect(errorFields(errors)).toContain(field);
    }
  );

  it("rejects a malformed email", async () => {
    const { errors } = await transform(RecruiterFilledDto, { ...VALID_RECRUITER, email: "not-an-email" });
    expect(errorFields(errors)).toContain("email");
  });

  it("accepts various valid email formats", async () => {
    for (const email of ["hr@example.com", "hr+tag@example.co.in", "hr.name@sub.domain.org"]) {
      const { errors } = await transform(RecruiterFilledDto, { ...VALID_RECRUITER, email });
      expect(errors).toHaveLength(0);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. SelectionProcedureDto
// ─────────────────────────────────────────────────────────────────────────────

describe("SelectionProcedureDto – required fields", () => {
  it("accepts a minimal valid payload", async () => {
    const { errors } = await transform(SelectionProcedureDto, VALID_SELECTION_PROCEDURE);
    expect(errors).toHaveLength(0);
  });

  it.each(["shortlistFromResume", "groupDiscussion", "tests", "interviews"] as const)(
    "rejects when required field '%s' is missing",
    async (field) => {
      const payload = { ...VALID_SELECTION_PROCEDURE };
      delete (payload as any)[field];
      const { errors } = await transform(SelectionProcedureDto, payload);
      expect(errorFields(errors)).toContain(field);
    }
  );
});

describe("SelectionProcedureDto – selectionMode (optional enum + coercion fix)", () => {
  // Valid enum values
  it.each(Object.values(SelectionModeEnum))(
    "accepts valid selectionMode '%s'",
    async (mode) => {
      const { instance, errors } = await transform(SelectionProcedureDto, {
        ...VALID_SELECTION_PROCEDURE,
        selectionMode: mode,
      });
      expect(errors).toHaveLength(0);
      expect(instance.selectionMode).toBe(mode);
    }
  );

  // Field is truly optional
  it("passes when selectionMode is absent", async () => {
    const { errors } = await transform(SelectionProcedureDto, { ...VALID_SELECTION_PROCEDURE });
    expect(errors).toHaveLength(0);
  });

  it("passes when selectionMode is explicitly undefined", async () => {
    const { errors } = await transform(SelectionProcedureDto, {
      ...VALID_SELECTION_PROCEDURE,
      selectionMode: undefined,
    });
    expect(errors).toHaveLength(0);
  });

  // Coercion: empty string and null → undefined (the bug fix)
  it("coerces empty string '' to undefined – no error (bug fix)", async () => {
    const { instance, errors } = await transform(SelectionProcedureDto, {
      ...VALID_SELECTION_PROCEDURE,
      selectionMode: "",
    });
    expect(errors).toHaveLength(0);
    expect(instance.selectionMode).toBeUndefined();
  });

  it("coerces null to undefined – no error (bug fix)", async () => {
    const { instance, errors } = await transform(SelectionProcedureDto, {
      ...VALID_SELECTION_PROCEDURE,
      selectionMode: null,
    });
    expect(errors).toHaveLength(0);
    expect(instance.selectionMode).toBeUndefined();
  });

  // Non-empty invalid values must still be rejected
  it("rejects an unknown string value 'BOTH'", async () => {
    const { errors } = await transform(SelectionProcedureDto, {
      ...VALID_SELECTION_PROCEDURE,
      selectionMode: "BOTH",
    });
    expect(errorFields(errors)).toContain("selectionMode");
  });

  it("rejects a numeric value for selectionMode", async () => {
    const { errors } = await transform(SelectionProcedureDto, {
      ...VALID_SELECTION_PROCEDURE,
      selectionMode: 1 as any,
    });
    expect(errorFields(errors)).toContain("selectionMode");
  });

  it("rejects a boolean value for selectionMode", async () => {
    const { errors } = await transform(SelectionProcedureDto, {
      ...VALID_SELECTION_PROCEDURE,
      selectionMode: true as any,
    });
    expect(errorFields(errors)).toContain("selectionMode");
  });
});

describe("SelectionProcedureDto – tests array", () => {
  it("accepts a valid test entry", async () => {
    const { errors } = await transform(SelectionProcedureDto, {
      ...VALID_SELECTION_PROCEDURE,
      tests: [{ type: TestTypesEnum.APTITUDE, duration: "60 mins" }],
    });
    expect(errors).toHaveLength(0);
  });

  it("accepts all TestTypesEnum values", async () => {
    for (const type of Object.values(TestTypesEnum)) {
      const { errors } = await transform(SelectionProcedureDto, {
        ...VALID_SELECTION_PROCEDURE,
        tests: [{ type, duration: "30 mins" }],
      });
      expect(errors).toHaveLength(0);
    }
  });

  it("rejects a test with an invalid type", async () => {
    const { errors } = await transform(SelectionProcedureDto, {
      ...VALID_SELECTION_PROCEDURE,
      tests: [{ type: "QUIZ", duration: "30 mins" }],
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("rejects a test missing duration", async () => {
    const { errors } = await transform(SelectionProcedureDto, {
      ...VALID_SELECTION_PROCEDURE,
      tests: [{ type: TestTypesEnum.TECHNICAL }],
    });
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe("SelectionProcedureDto – interviews array", () => {
  it("accepts a valid interview entry", async () => {
    const { errors } = await transform(SelectionProcedureDto, {
      ...VALID_SELECTION_PROCEDURE,
      interviews: [{ type: InterviewTypesEnum.HR, duration: "45 mins" }],
    });
    expect(errors).toHaveLength(0);
  });

  it("accepts all InterviewTypesEnum values", async () => {
    for (const type of Object.values(InterviewTypesEnum)) {
      const { errors } = await transform(SelectionProcedureDto, {
        ...VALID_SELECTION_PROCEDURE,
        interviews: [{ type, duration: "30 mins" }],
      });
      expect(errors).toHaveLength(0);
    }
  });

  it("rejects an interview with an invalid type", async () => {
    const { errors } = await transform(SelectionProcedureDto, {
      ...VALID_SELECTION_PROCEDURE,
      interviews: [{ type: "GROUP_DISCUSSION", duration: "30 mins" }],
    });
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe("SelectionProcedureDto – optional fields", () => {
  it("accepts optional 'others' string", async () => {
    const { errors } = await transform(SelectionProcedureDto, {
      ...VALID_SELECTION_PROCEDURE,
      others: "Candidates must bring portfolio",
    });
    expect(errors).toHaveLength(0);
  });

  it("accepts optional requirements object", async () => {
    const { errors } = await transform(SelectionProcedureDto, {
      ...VALID_SELECTION_PROCEDURE,
      requirements: { numberOfMembers: 5, numberOfRooms: 2, otherRequirements: "projector" },
    });
    expect(errors).toHaveLength(0);
  });

  it("accepts empty requirements object (all fields optional)", async () => {
    const { errors } = await transform(SelectionProcedureDto, {
      ...VALID_SELECTION_PROCEDURE,
      requirements: {},
    });
    expect(errors).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. JafDto – job sub-object
// ─────────────────────────────────────────────────────────────────────────────

describe("JafDto – job field validation", () => {
  it("accepts a minimal valid JAF payload", async () => {
    const { errors } = await transform(JafDto, VALID_JAF);
    expect(errors).toHaveLength(0);
  });

  it("rejects when job is missing", async () => {
    const payload = { ...VALID_JAF };
    delete (payload as any).job;
    const { errors } = await transform(JafDto, payload);
    expect(errorFields(errors)).toContain("job");
  });

  it("rejects when salaries array is missing", async () => {
    const payload = { ...VALID_JAF };
    delete (payload as any).salaries;
    const { errors } = await transform(JafDto, payload);
    expect(errorFields(errors)).toContain("salaries");
  });

  it("rejects when job.seasonId is missing", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      job: { ...VALID_JOB, seasonId: undefined },
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("rejects when job.seasonId is not a UUID", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      job: { ...VALID_JOB, seasonId: "not-a-uuid" },
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("rejects when job.role is missing", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      job: { ...VALID_JOB, role: undefined },
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("rejects when job.selectionProcedure is missing", async () => {
    const job = { ...VALID_JOB };
    delete (job as any).selectionProcedure;
    const { errors } = await transform(JafDto, { ...VALID_JAF, job });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("rejects when job.recruiterDetailsFilled is missing", async () => {
    const job = { ...VALID_JOB };
    delete (job as any).recruiterDetailsFilled;
    const { errors } = await transform(JafDto, { ...VALID_JAF, job });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("accepts multiple recruiters in recruiterDetailsFilled", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      job: {
        ...VALID_JOB,
        recruiterDetailsFilled: [VALID_RECRUITER, { ...VALID_RECRUITER, name: "John Smith", email: "john@company.com" }],
      },
    });
    expect(errors).toHaveLength(0);
  });

  it("rejects when a recruiter in recruiterDetailsFilled has invalid email", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      job: {
        ...VALID_JOB,
        recruiterDetailsFilled: [{ ...VALID_RECRUITER, email: "bad-email" }],
      },
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("accepts valid optional job fields", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      job: {
        ...VALID_JOB,
        description: "Exciting role",
        location: "Indore, MP",
        duration: "6 months",
        minNoOfHires: 2,
        expectedNoOfHires: 5,
        skills: ["TypeScript", "NestJS"],
        attachments: ["jd.pdf"],
        others: "Additional info",
      },
    });
    expect(errors).toHaveLength(0);
  });

  // Nested selectionProcedure coercion propagates through JafDto
  it("coerces selectionMode '' to undefined inside JafDto (no error)", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      job: {
        ...VALID_JOB,
        selectionProcedure: { ...VALID_SELECTION_PROCEDURE, selectionMode: "" },
      },
    });
    expect(errors).toHaveLength(0);
  });

  it("rejects invalid selectionMode inside JafDto", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      job: {
        ...VALID_JOB,
        selectionProcedure: { ...VALID_SELECTION_PROCEDURE, selectionMode: "INVALID" },
      },
    });
    expect(errors.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. JafDto – salaries array
// ─────────────────────────────────────────────────────────────────────────────

describe("JafDto – salary validation", () => {
  it("accepts an empty salaries array", async () => {
    const { errors } = await transform(JafDto, { ...VALID_JAF, salaries: [] });
    expect(errors).toHaveLength(0);
  });

  it("accepts a salary with placement fields", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      salaries: [{
        baseSalary: 1200000,
        totalCTC: 1500000,
        takeHomeSalary: 90000,
        grossSalary: 100000,
        otherCompensations: 50000,
        joiningBonus: 100000,
        performanceBonus: 200000,
      }],
    });
    expect(errors).toHaveLength(0);
  });

  it("accepts a salary with internship fields", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      salaries: [{
        stipend: 50000,
        foreignCurrencyStipend: "USD 2000",
        accommodation: true,
        ppoProvisionOnPerformance: true,
        tentativeCTC: 1200000,
      }],
    });
    expect(errors).toHaveLength(0);
  });

  it("accepts valid genders array in salary", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      salaries: [{ genders: [GenderEnum.MALE, GenderEnum.FEMALE] }],
    });
    expect(errors).toHaveLength(0);
  });

  it("rejects invalid gender in salary genders array", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      salaries: [{ genders: ["NONBINARY"] }],
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("accepts valid categories array in salary", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      salaries: [{ categories: [CategoryEnum.GENERAL, CategoryEnum.OBC, CategoryEnum.SC] }],
    });
    expect(errors).toHaveLength(0);
  });

  it("rejects invalid category in salary categories array", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      salaries: [{ categories: ["INVALID_CAT"] }],
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it.each(Object.values(BacklogEnum))(
    "accepts valid isBacklogAllowed '%s'",
    async (val) => {
      const { errors } = await transform(JafDto, {
        ...VALID_JAF,
        salaries: [{ isBacklogAllowed: val }],
      });
      expect(errors).toHaveLength(0);
    }
  );

  it("coerces isBacklogAllowed '' to undefined – no error", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      salaries: [{ isBacklogAllowed: "" as any }],
    });
    expect(errors).toHaveLength(0);
  });

  it("rejects invalid isBacklogAllowed value", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      salaries: [{ isBacklogAllowed: "SOMETIMES" as any }],
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("accepts valid UUID array in programs", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      salaries: [{ programs: [uuid(), uuid()] }],
    });
    expect(errors).toHaveLength(0);
  });

  it("rejects non-UUID values in programs array", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      salaries: [{ programs: ["not-a-uuid"] }],
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("accepts multiple salary entries", async () => {
    const { errors } = await transform(JafDto, {
      ...VALID_JAF,
      salaries: [
        { baseSalary: 1000000, totalCTC: 1200000 },
        { stipend: 40000, genders: [GenderEnum.FEMALE] },
      ],
    });
    expect(errors).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Full JAF round-trip – rich realistic payload
// ─────────────────────────────────────────────────────────────────────────────

describe("JafDto – full realistic payload", () => {
  const FULL_JAF = {
    job: {
      seasonId: uuid(),
      role: "Backend Engineer",
      description: "Build scalable APIs using NestJS and PostgreSQL.",
      location: "Bengaluru / Remote",
      duration: "Full-time",
      minNoOfHires: 3,
      expectedNoOfHires: 10,
      skills: ["TypeScript", "PostgreSQL", "Docker"],
      attachments: ["jd_backend.pdf"],
      recruiterDetailsFilled: [
        {
          name: "Alice HR",
          email: "alice@techcorp.com",
          contact: "+919876543210",
          designation: "Senior HR",
          landline: "080-12345678",
        },
      ],
      selectionProcedure: {
        selectionMode: SelectionModeEnum.HYBRID,
        shortlistFromResume: true,
        groupDiscussion: false,
        tests: [
          { type: TestTypesEnum.APTITUDE, duration: "60 mins" },
          { type: TestTypesEnum.TECHNICAL, duration: "90 mins" },
        ],
        interviews: [
          { type: InterviewTypesEnum.TECHNICAL, duration: "45 mins" },
          { type: InterviewTypesEnum.HR, duration: "30 mins" },
        ],
        requirements: {
          numberOfMembers: 10,
          numberOfRooms: 3,
          otherRequirements: "Projector and whiteboards needed",
        },
        others: "Candidates should carry printed resume",
      },
    },
    salaries: [
      {
        genders: [GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.OTHER],
        categories: [CategoryEnum.GENERAL, CategoryEnum.OBC],
        isBacklogAllowed: BacklogEnum.NEVER,
        minCPI: 7.0,
        tenthMarks: 75,
        twelthMarks: 75,
        baseSalary: 1500000,
        totalCTC: 2000000,
        takeHomeSalary: 110000,
        grossSalary: 130000,
        joiningBonus: 200000,
        performanceBonus: 300000,
        relocation: 50000,
        otherCompensations: 100000,
        salaryPeriod: "Annual",
        others: "ESOP cliff at 1 year",
      },
    ],
  };

  it("passes validation for a full realistic JAF payload", async () => {
    const { errors } = await transform(JafDto, FULL_JAF);
    expect(errors).toHaveLength(0);
  });

  it("correctly transforms and preserves all enum values", async () => {
    const { instance } = await transform(JafDto, FULL_JAF);
    expect(instance.job.selectionProcedure.selectionMode).toBe(SelectionModeEnum.HYBRID);
    expect(instance.salaries[0].isBacklogAllowed).toBe(BacklogEnum.NEVER);
    expect(instance.salaries[0].genders).toEqual([GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.OTHER]);
  });
});
