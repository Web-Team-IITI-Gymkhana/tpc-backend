import { Controller, Query, Body, Param, ParseUUIDPipe, UseInterceptors, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { StudentService } from "./student.service";
import { DeleteValues, GetValue, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { StudentsQueryDto } from "./dtos/query.dto";
import { GetStudentDto, GetStudentsDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { CreateStudentsDto } from "./dtos/post.dto";
import { UpdateStudentsDto } from "./dtos/patch.dto";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";

@Controller("students")
@ApiTags("Student")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class StudentController {
  constructor(private studentService: StudentService) {}

  @GetValues(StudentsQueryDto, GetStudentsDto)
  @UseGuards(new RoleGuard(RoleEnum.TPC_MEMBER))
  async getStudents(@Query("q") where: StudentsQueryDto) {
    const ans = await this.studentService.getStudents(where);
    return pipeTransformArray(ans, GetStudentsDto);
  }

  @GetValue(GetStudentDto)
  @UseGuards(new RoleGuard(RoleEnum.TPC_MEMBER))
  async getStudent(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.studentService.getStudent(id);
    return pipeTransform(ans, GetStudentDto);
  }

  @PostValues(CreateStudentsDto)
  @UseGuards(new RoleGuard(RoleEnum.ADMIN))
  async createStudents(@Body(createArrayPipe(CreateStudentsDto)) students: CreateStudentsDto[]) {
    const ans = await this.studentService.createStudents(students);
    return ans;
  }

  @PatchValues(UpdateStudentsDto)
  @UseGuards(new RoleGuard(RoleEnum.ADMIN))
  @UseInterceptors(TransactionInterceptor)
  async updateStudents(
    @Body(createArrayPipe(UpdateStudentsDto)) students: UpdateStudentsDto[],
    @TransactionParam() t: Transaction
  ) {
    const pr = students.map((student) => this.studentService.updateStudent(student, t));
    const ans = await Promise.all(pr);
    return ans.flat();
  }

  @DeleteValues()
  @UseGuards(new RoleGuard(RoleEnum.ADMIN))
  async deleteStudents(@Query() query: DeleteValuesDto) {
    const ids = query.id;
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.studentService.deleteStudents(pids);
    return ans;
  }
}
