import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { FindOptions, Transaction } from "sequelize";
import { STUDENT_DAO, USER_DAO } from "src/constants";
import { PenaltyModel, ProgramModel, StudentModel, UserModel } from "src/db/models";
import { optionsFactory, parseFilter, parseOrder } from "src/utils";

@Injectable()
export class StudentService {
  constructor(
    @Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel
  ) {}

  async getStudents(where) {
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
    const options = optionsFactory(where);
    Object.assign(findOptions, options);
    const filterBy = where.filterBy || {};
    findOptions.order = parseOrder(where.orderBy || {});

    if (filterBy.user) {
      findOptions.include[0].where = parseFilter(filterBy.user);
      delete filterBy.user;
    }
    if (filterBy.program) {
      findOptions.include[1].where = parseFilter(filterBy.program);
      delete filterBy.program;
    }
    findOptions.where = parseFilter(filterBy);

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
          model: PenaltyModel,
          as: "penalties", //Not many penalties per student.
        },
      ],
    });

    const res: StudentModel & { totalPenalty?: number } = ans.get({ plain: true });
    res.totalPenalty = 0;
    res.penalties.forEach((penalty) => (res.totalPenalty += penalty.penalty));

    return res;
  }

  async createStudents(students): Promise<string[]> {
    const ans = await this.studentRepo.bulkCreate(students, {
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
    });

    return ans.map((student) => student.id);
  }

  async updateStudent(student, t: Transaction) {
    const ans = await this.studentRepo.findByPk(student.id);
    if (!ans) throw new NotFoundException(`No student with id: ${student.id} Found`);

    const pr = [];
    pr.push(
      this.studentRepo.update(student, {
        where: { id: ans.id },
        transaction: t,
      })
    );

    if (student.user) {
      pr.push(
        this.userRepo.update(student.user, {
          where: { id: ans.userId },
          transaction: t,
        })
      );
    }

    await Promise.all(pr);

    return true;
  }

  async deleteStudent(id: string, t: Transaction) {
    const ans = await this.studentRepo.findByPk(id);
    if (!ans) throw new NotFoundException(`No student with id: ${id} Found`);

    await this.studentRepo.destroy({
      where: { id: id },
      transaction: t,
    });

    await this.userRepo.destroy({
      where: { id: ans.userId },
      transaction: t,
    });

    return true;
  }
}
