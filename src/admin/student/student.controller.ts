import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  Patch,
} from "@nestjs/common";
import { StudentService } from "./student.service";
import { studentSearchDto } from "./studentSearch.dto";

@Controller("admin/student")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  createstudent(@Body() Students: any): Promise<any> {
    return this.studentService.create(Students);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  getstudent(@Body() student: studentSearchDto): Promise<any> {
    return this.studentService.get(student);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  updatestudent(@Body() student: any): Promise<any> {
    return this.studentService.update(student);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  deletestudent(@Body() student: any): Promise<any> {
    return this.studentService.delete(student);
  }
}
