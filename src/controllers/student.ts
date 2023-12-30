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
import { STUDENT_SERVICE, USER_SERVICE } from "src/constants";
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


@Controller("/students")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class StudentController {
  constructor(
    @Inject(STUDENT_SERVICE) private studentService: StudentService,
    @Inject(USER_SERVICE) private userService: UserService
  ) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getStudents(@Query() query: GetStudentQueryDto) {
    const students = await this.studentService.getStudents({
      id: query.id,
      userId: query.userId,
      category: query.category,
      gender: query.gender,
      programId: query.programId,
    });
    for (const student of students) {
      student.user = await this.userService.getUserById(student.userId);
    }
    return { students: students };
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async addStudents(@Body() body: AddStudentsDto, @TransactionParam() transaction: Transaction) {
    const promises = [];
    for (const student of body.students) {
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            const user = await this.userService.getOrCreateUser(
              new User({ name: student.name, email: student.email, contact: student.contact, role: Role.STUDENT }),
              transaction
            );
            const newStudent = await this.studentService.getOrCreateStudent(
              new Student({
                userId: user.id,
                rollNo: student.rollNo,
                category: student.category,
                gender: student.gender,
                programId: student.programId,
              }),
              transaction
            );
            newStudent.user = user;
            resolve(newStudent);
          } catch (err) {
            reject(err);
          }
        })
      );
    }
    const students = await Promise.all(promises);
    return { students: students };
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
    const newUser = await UpdateOrFind(newStudent.userId, User, this.userService, "updateUser", "getUserById",transaction);
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
}
