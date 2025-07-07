import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { STUDENT_DAO, USER_DAO } from "src/constants";
import { PenaltyModel, ProgramModel, ResumeModel, StudentModel, UserModel } from "src/db/models";
import { StudentsQueryDto } from "./dtos/query.dto";
import { FindOptions, Transaction } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateStudentsDto } from "./dtos/post.dto";
import { UpdateStudentsDto } from "./dtos/patch.dto";
import { omit } from "lodash";
import sequelize from "sequelize";
import { RoleEnum } from "src/enums";

@Injectable()
export class StudentService {
  constructor(
    @Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel
  ) {}

  async getStudents(where: StudentsQueryDto) {
    const findOptions: FindOptions<StudentModel> = {
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
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.studentRepo.findAll(findOptions);

    return ans.map((student) => student.get({ plain: true }));
  }

  async getStudent(id: string) {
    const ans = await this.studentRepo.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "user",
        },
        {
          model: ProgramModel,
          as: "program",
        },
        {
          model: ResumeModel,
          as: "resumes",
        },
        {
          model: PenaltyModel,
          as: "penalties",
        },
      ],
    });

    if (!ans) throw new NotFoundException(`The Student with id: ${id} does not exist`);
    const totalPenalty = ans.penalties.reduce((acc, penalty) => acc + penalty.penalty, 0);

    return { ...ans.get({ plain: true }), totalPenalty };
  }

  async createStudents(students: CreateStudentsDto[]) {
    const transaction = await this.studentRepo.sequelize.transaction();

    try {
      students.forEach((student) => {
        student.user.role = RoleEnum.STUDENT;
      });

      const ans = await this.studentRepo.bulkCreate(students as any[], {
        include: [{ model: UserModel, as: "user" }],
        transaction,
      });

      await transaction.commit();

      return ans.map((student) => student.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateStudent(student: UpdateStudentsDto, t: Transaction) {
    const [[ans], [res]] = await Promise.all([
      this.studentRepo.update(omit(student, "user"), { where: { id: student.id }, transaction: t }),
      this.userRepo.update(student.user, {
        where: sequelize.literal(`"id" IN (SELECT "userId" FROM "Student" WHERE "id" = '${student.id}')`),
        transaction: t,
      }),
    ]);

    return ans > 0 || res > 0 ? [] : [student.id];
  }

  async deleteStudents(ids: string[]) {
    const ans = await this.userRepo.destroy({
      where: sequelize.literal(
        `"id" IN (SELECT "userId" FROM "Student" WHERE "id" IN (${ids.map((id) => `'${id}'`).join(",")}))`
      ),
    });

    return ans;
  }
}
