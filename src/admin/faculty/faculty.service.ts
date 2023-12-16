import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FacultyCoordinator as faculty } from "../../db/models/facultyCoordinator";
import { Member } from "src/db/models/member";
import { FacultyCoordinator } from "src/db/models/facultyCoordinator";
import { Role } from "src/db/enums/role.enum";
import { Sequelize } from "sequelize-typescript";
import { facultyDto } from "./faculty.dto";

@Injectable()
export class facultyService {
  //   configService: any;
  constructor(
    private config: ConfigService,
    private sequelize: Sequelize
  ) {}

  createFaculty = async (faculty: facultyDto) => {
    const t = await this.sequelize.transaction();
    try {
      const { name, contact, email, department } = faculty;
      console.log(t);
      // inserting facultys in the member
      const [statusFound, created] = await Member.findOrCreate({
        where: { email },
        defaults: { name, email, contact, role: Role.FACULTY },
        transaction: t,
      });

      if (!created) {
        // updating both member and faculty bcoz they already exists
        const [rowsUpdated, [updatedEntity]] = await Member.update(
          { name, role: Role.FACULTY, email, contact },
          {
            where: { email },
            returning: true,
            transaction: t,
          }
        );
        const [rowsUpdated1, [newfaculty]] = await FacultyCoordinator.update(
          {
            department,
          },
          // facultyEntry,
          {
            where: { memberId: updatedEntity.id },
            returning: true,
            transaction: t,
          }
        );
        await t.commit();
        return { data: newfaculty, status: 200 };
      } else {
        // creating new faculty
        const newfaculty = await FacultyCoordinator.create(
          {
            memberId: statusFound.id,
            department,
          },
          { transaction: t }
        );
        await t.commit();
        return { data: newfaculty, status: 200 };
      }
    } catch (err) {
      t.rollback();
      console.log(err);
      throw err;
    }
  };
  async create(faculty: any): Promise<any> {
    const notDone = [];
    try {
      const createfacultyPromises = faculty.map(async (faculty: facultyDto) => {
        try {
          const ans = await this.createFaculty(faculty);
          return ans;
        } catch (err) {
          notDone.push(faculty);
          throw err;
        }
      });
      const createdfaculty = await Promise.allSettled(createfacultyPromises);
      for (const faculty of createdfaculty) {
        if (faculty.status == "rejected") {
          throw faculty.reason;
        }
      }
      return { status: 200, output: createdfaculty };
    } catch (error) {
      return { status: 400, rolledBackQueries: notDone, error: error };
    }
  }

  queryBuilder = (params: any) => {
    let facultyQuery: any = {},
      memberQuery: any = {};
    if (params.department) {
      facultyQuery.department = params.department;
    }
    if (params.name) {
      memberQuery.name = params.name;
    }
    if (params.email) {
      memberQuery.email = params.email;
    }
    if (params.contact) {
      memberQuery.contact = params.contact;
    }
    memberQuery.role = Role.FACULTY;
    return { facultyQuery, memberQuery };
  };

  async get(searchParams: facultyDto): Promise<any> {
    try {
      const { name, contact, email, department } = searchParams;
      const { facultyQuery, memberQuery } = this.queryBuilder(searchParams);
      const result = await faculty.findAll({
        where: facultyQuery,
        include: {
          model: Member,
          where: memberQuery,
          required: true,
        },
      });
      return { status: 200, data: result };
    } catch (error) {
      console.log(error);
      return { status: 400, error: error };
    }
  }

  async updateFaculty(faculty) {
    const t = await this.sequelize.transaction();
    try {
      const memberId = faculty.memberId;
      const updateParams = faculty.update;
      const { facultyQuery, memberQuery } = this.queryBuilder(updateParams);
      console.log(facultyQuery);
      console.log(memberQuery);
      const result1 = faculty.update(facultyQuery, {
        where: { memberId: memberId },
        transaction: t,
      });
      const result2 = Member.update(memberQuery, {
        where: { id: memberId },
        transaction: t,
      });
      const ans = await Promise.all([result1, result2]);
      await t.commit();
      return ans;
    } catch (err) {
      console.log(err);
      await t.rollback();
      throw err;
    }
  }

  async update(facultys: any): Promise<any> {
    const notDone = [];
    try {
      const createfacultyPromises = facultys.map(async (faculty: any) => {
        try {
          const ans = await this.updateFaculty(faculty);
          return ans;
        } catch (err) {
          notDone.push(faculty);
          throw err;
        }
      });
      const updatedfacultys = await Promise.allSettled(createfacultyPromises);
      for (const faculty of updatedfacultys) {
        if (faculty.status == "rejected") {
          throw faculty.reason;
        }
      }
      return { status: 200, output: updatedfacultys };
    } catch (error) {
      return { status: 400, rolledBackQueries: notDone, error: error };
    }
  }

  async delete(facultys: any) {
    try {
      const res1 = await Member.destroy({
        where: {
          id: facultys,
        },
      });
      return { status: 200, output: res1 };
    } catch (err) {
      return { status: 400, error: err };
    }
  }
}
