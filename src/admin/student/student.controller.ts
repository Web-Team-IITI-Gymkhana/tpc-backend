import { Body, Controller, HttpCode, HttpStatus, Post, Get, Delete, Patch } from "@nestjs/common";
import { studentService } from "./student.service";
import { studentSearchDto } from "./dto/studentSearch.dto";
import { studentUpdateDto } from "./dto/studentUpdate.dto";
import { studentDto } from "./dto/student.dto";

@Controller("admin/student")
export class studentController {
  constructor(private readonly studentService: studentService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  createStudent(@Body() Students: studentDto[]): Promise<any> {
    try {
      return this.studentService.create(Students);
    } catch (err) {
      console.log(err);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  getStudent(@Body() student: studentSearchDto): Promise<any> {
    return this.studentService.get(student);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  updateStudent(@Body() student: studentUpdateDto[]): Promise<any> {
    return this.studentService.update(student);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  deleteStudent(@Body() student: String[]): Promise<any> {
    return this.studentService.delete(student);
  }
}
