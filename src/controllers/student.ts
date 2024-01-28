import {
  Controller,
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Delete,
  Param,
  Put,
} from "@nestjs/common";
import { PENALTY_SERVICE, STUDENT_SERVICE, USER_SERVICE } from "src/constants";
import StudentService from "src/services/StudentService";
import { AddStudentsDto, GetStudentQueryDto, UpdateStudentDto, studentIdParamDto } from "../dtos/student";
import { Student } from "src/entities/Student";
import UserService from "src/services/UserService";
import { User } from "src/entities/User";
import { Role } from "src/db/enums";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { HttpException } from "@nestjs/common/exceptions";
import { HttpStatus } from "@nestjs/common/enums";
import { UpdateOrFind } from "src/utils/utils";
import { CreatePenaltiesDto, PenaltyIdParamDto, UpdatePenaltyDto } from "src/dtos/penalty";
import { Penalty } from "src/entities/Penalty";
import PenaltyService from "src/services/PenaltyService";


@Controller("/students")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class StudentController {
  constructor(
    @Inject(STUDENT_SERVICE) private studentService: StudentService,
    @Inject(USER_SERVICE) private userService: UserService,
    @Inject(PENALTY_SERVICE) private penaltyService: PenaltyService
  ) { }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getStudents(@Query() query: GetStudentQueryDto) {
    const students = await this.studentService.getStudents({
      id: query.id,
      userId: query.userId,
      category: query.category,
      gender: query.gender,
      programId: query.programId,
    },
    {
      id: query.userId,
      name: query.name,
      email: query.email,
      contact: query.contact,
    });
    return { students: students };
  }

  // @Post()
  // @UseInterceptors(TransactionInterceptor)
  // @UseInterceptors(ClassSerializerInterceptor)
  // async addStudents(@Body() body: AddStudentsDto, @TransactionParam() transaction: Transaction) {
  //   const promises = [];
  //   for (const student of body.students) {
  //     promises.push(
  //       new Promise(async (resolve, reject) => {
  //         try {
  //           const user = await this.userService.getOrCreateUser(
  //             new User({ name: student.name, email: student.email, contact: student.contact, role: Role.STUDENT }),
  //             transaction
  //           );
  //           const newStudent = await this.studentService.getOrCreateStudent(
  //             new Student({
  //               userId: user.id,
  //               rollNo: student.rollNo,
  //               category: student.category,
  //               gender: student.gender,
  //               programId: student.programId,
  //             }),
  //             transaction
  //           );
  //           newStudent.user = user;
  //           resolve(newStudent);
  //         } catch (err) {
  //           reject(err);
  //         }
  //       })
  //     );
  //   }
  //   const students = await Promise.all(promises);
  //   return { students: students };
  // }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async addStudents(@Body() body: AddStudentsDto, @TransactionParam() transaction: Transaction) {
    const userArray = body.students.map(student => {
      return {
        name: student.name,
        email: student.email,
        contact: student.contact,
        role: Role.STUDENT,
      };
    });

    const createdUsers = await this.userService.bulkCreateUsers(userArray, transaction);

    const studentArray = createdUsers.map((user, index) => {
      return {
        userId: user.id,
        rollNo: body.students[index].rollNo,
        category: body.students[index].category,
        gender: body.students[index].gender,
        programId: body.students[index].programId,
      };
    });

    const createdStudents = await this.studentService.bulkCreateStudents(studentArray, transaction);

    // Associate the created users with their respective students
    createdStudents.forEach((student, index) => {
      student.user = createdUsers[index];
    });

    return { students: createdStudents };
  }

  querybuilder(params) {
    let Student = {};
    let User = {};
    if (params.rollNo) {
      Student[`rollNo`] = params.rollNo;
    }
    if (params.category) {
      Student[`category`] = params.category;
    }
    if (params.programId) {
      Student[`programId`] = params.programId;
    }
    if (params.gender) {
      Student[`gender`] = params.gender;
    }
    if (params.name) {
      User["name"] = params.name;
    }
    if (params.email) {
      User["email"] = params.email;
    }
    if (params.contact) {
      User["contact"] = params.contact;
    }
    if (params.role) {
      User["role"] = params.role;
    }

    return { Student, User };
  }

  @Put("/:studentId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async updateStudent(
    @Param() param: studentIdParamDto,
    @Body() body: UpdateStudentDto,
    @TransactionParam() transaction: Transaction
  ) {
    const [student] = await this.studentService.getStudents({
      id: param.studentId,
    });
    if (!student) {
      throw new HttpException(`Student with StudentId: ${param.studentId} not found`, HttpStatus.NOT_FOUND);
    }
    const { Student, User } = this.querybuilder(body);
    const newStudent = await UpdateOrFind(
      param.studentId,
      Student,
      this.studentService,
      "updateStudent",
      "getStudents",
      transaction
    );
    const newUser = await UpdateOrFind(newStudent.userId, User, this.userService, "updateUser", "getUserById", transaction);
    newStudent.user = newUser;
    return { student: newStudent };
  }

  @Delete("/:studentId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async deleteStudent(@Param() param: studentIdParamDto, @TransactionParam() transaction: Transaction) {
    const [student] = await this.studentService.getStudents({
      id: param.studentId,
    });
    if (!student) {
      throw new HttpException(`Student with StudentId: ${param.studentId} not found`, HttpStatus.NOT_FOUND);
    }
    const studentDeleted = await this.studentService.deleteStudent(param.studentId, transaction);
    const userDeleted = await this.userService.deleteUser(student.userId, transaction);
    return { deleted: userDeleted && studentDeleted };
  }

  @Get("/:studentId/penalty")
  @UseInterceptors(ClassSerializerInterceptor)
  async getPenalties(@Param() param: studentIdParamDto) {
    const penalties = await this.penaltyService.getPenalties({ studentId: param.studentId });
    return { penalties: penalties };
  }

  @Post("/:studentId/penalty")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async createPenalty(
    @Param() param: studentIdParamDto,
    @Body() body: CreatePenaltiesDto,
    @TransactionParam() transaction: Transaction
  ) {
    const promises = [];
    for (const penalty of body.penalties) {
      promises.push(
        this.penaltyService.createPenalty(
          new Penalty({
            studentId: param.studentId,
            penalty: penalty.penalty,
            reason: penalty.reason,
          }),
          transaction
        ));
    }
    const penalties = await Promise.all(promises);
    return { penalties: penalties };
  }

  @Put("/penalty/:penaltyId")
  @UseInterceptors(ClassSerializerInterceptor)
  async updatePenalty(@Param() param: studentIdParamDto & PenaltyIdParamDto, @Body() body: UpdatePenaltyDto) {
    const [penalty] = await this.penaltyService.getPenalties({ id: param.penaltyId });
    if (!penalty) {
      throw new HttpException(`Penalty with PenaltyId: ${param.penaltyId} not found`, HttpStatus.NOT_FOUND);
    }
    const newPenalty = await this.penaltyService.updatePenalty(param.penaltyId, body);
    return { penalty: newPenalty };
  }

  @Delete("/penalty/:penaltyId")
  @UseInterceptors(ClassSerializerInterceptor)
  async deletePenalty(@Param() param: studentIdParamDto & PenaltyIdParamDto) {
    const [penalty] = await this.penaltyService.getPenalties({
      id: param.penaltyId,
    });
    if (!penalty) {
      throw new HttpException(`penalty with penaltyId: ${param.penaltyId} not found`, HttpStatus.NOT_FOUND);
    }
    const deleted = await this.penaltyService.deletePenalty(param.penaltyId);
    return { deleted: deleted };
  }
}
