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
  Patch,
  ParseArrayPipe,
} from "@nestjs/common";
import { PENALTY_SERVICE, STUDENT_SERVICE, USER_SERVICE } from "src/constants";
import StudentService from "src/services/StudentService";
import { CreateStudentDto } from "../dtos/student";
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
import { UpdateOrFind, bulkOperate, conformToModel, find_order, makeFilter, optionsFactory } from "src/utils/utils";
import { CreatePenaltiesDto, PenaltyIdParamDto, UpdatePenaltyDto } from "src/dtos/penalty";
import { Penalty } from "src/entities/Penalty";
import PenaltyService from "src/services/PenaltyService";
import { ProgramModel, StudentModel, UserModel } from "src/db/models";
import { QueryInterceptor } from "src/interceptor/QueryInterceptor";
import { getAttributes } from "sequelize-typescript";

@Controller("/students")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class StudentController {
  constructor(
    @Inject(STUDENT_SERVICE) private studentService: StudentService,
    @Inject(USER_SERVICE) private userService: UserService,
    @Inject(PENALTY_SERVICE) private penaltyService: PenaltyService
  ) {}

  //Template Starts.

  @Get()
  @UseInterceptors(QueryInterceptor)
  async getStudents(@Query() where: any) {
    const models = [StudentModel, UserModel, ProgramModel];
    const alias = ["", "user", "program"];
    const filterBy = where.filterBy || {};
    const orders = where.orderBy || {};
    const options = {};
    const filters = [];

    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      filters.push(makeFilter(conformToModel(filterBy, model)));
      const orderBy = conformToModel(orders, model);
      if (Object.keys(orderBy).length) {
        const res = find_order(orderBy, model);
        options["order"] = [[{ model: model, as: alias[i] }, res[0], res[1]]];
      }
    }

    if (options["order"] && options["order"][0][0]["as"] == "")    
          options["order"][0] = [options["order"][0][1], options["order"][0][2]];
    const ans = this.studentService.getStudents(filters, options);
    return ans;
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async createStudents(
    @Body(new ParseArrayPipe({ items: CreateStudentDto })) body: CreateStudentDto[],
    @TransactionParam() transaction: Transaction
  ) {
    const data = [];
    for (const student of body) {
      student["role"] = Role.STUDENT;
      const stud = conformToModel(student, StudentModel);
      const user = conformToModel(student, UserModel);
      stud["user"] = user;
      data.push(stud);
    }
    const ans = this.studentService.createStudents(data, transaction);
    return ans;
  }

  @Patch()
  async updateStudents(@Body() body: any) {
    const models = [UserModel, StudentModel ];
    const data = [];
    for(const value of body) {
      const student = conformToModel(body, StudentModel);
      const user = conformToModel(body, UserModel);
      student['user'] = user;
      data.push(student);
    }
    const ans = await bulkOperate(this.studentService, 'updateStudent', data);
    return ans;
  }

  // @Delete()
  // async deleteStudents(@Query() query: any) {
  //   return this.studentService.deleteStudents(query);
  // }

  //Template Ends.

  // @Get("/:studentId/penalty")
  // @UseInterceptors(ClassSerializerInterceptor)
  // async getPenalties(@Param() param: studentIdParamDto) {
  //   const penalties = await this.penaltyService.getPenalties({ studentId: param.studentId });
  //   return { penalties: penalties };
  // }

  // @Post("/:studentId/penalty")
  // @UseInterceptors(ClassSerializerInterceptor)
  // @UseInterceptors(TransactionInterceptor)
  // async createPenalty(
  //   @Param() param: studentIdParamDto,
  //   @Body() body: CreatePenaltiesDto,
  //   @TransactionParam() transaction: Transaction
  // ) {
  //   const promises = [];
  //   for (const penalty of body.penalties) {
  //     promises.push(
  //       this.penaltyService.createPenalty(
  //         new Penalty({
  //           studentId: param.studentId,
  //           penalty: penalty.penalty,
  //           reason: penalty.reason,
  //         }),
  //         transaction
  //       )
  //     );
  //   }
  //   const penalties = await Promise.all(promises);
  //   return { penalties: penalties };
  // }

  // @Put("/penalty/:penaltyId")
  // @UseInterceptors(ClassSerializerInterceptor)
  // async updatePenalty(@Param() param: studentIdParamDto & PenaltyIdParamDto, @Body() body: UpdatePenaltyDto) {
  //   const [penalty] = await this.penaltyService.getPenalties({ id: param.penaltyId });
  //   if (!penalty) {
  //     throw new HttpException(`Penalty with PenaltyId: ${param.penaltyId} not found`, HttpStatus.NOT_FOUND);
  //   }
  //   const newPenalty = await this.penaltyService.updatePenalty(param.penaltyId, body);
  //   return { penalty: newPenalty };
  // }

  // @Delete("/penalty/:penaltyId")
  // @UseInterceptors(ClassSerializerInterceptor)
  // async deletePenalty(@Param() param: studentIdParamDto & PenaltyIdParamDto) {
  //   const [penalty] = await this.penaltyService.getPenalties({
  //     id: param.penaltyId,
  //   });
  //   if (!penalty) {
  //     throw new HttpException(`penalty with penaltyId: ${param.penaltyId} not found`, HttpStatus.NOT_FOUND);
  //   }
  //   const deleted = await this.penaltyService.deletePenalty(param.penaltyId);
  //   return { deleted: deleted };
  // }
}
