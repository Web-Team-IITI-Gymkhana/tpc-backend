import { Body, Controller, HttpCode, HttpStatus, Post, Get, Delete, Patch } from "@nestjs/common";
import { facultyService } from "./faculty.service";
import { facultyDto } from "./faculty.dto";

@Controller("admin/faculty")
export class facultyController {
  constructor(private readonly facultyService: facultyService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  createFaculty(@Body() Faculty: any): Promise<any> {
    return this.facultyService.create(Faculty);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  getFaculty(@Body() faculty: facultyDto): Promise<any> {
    return this.facultyService.get(faculty);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  updateFaculty(@Body() faculty: any): Promise<any> {
    return this.facultyService.update(faculty);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(TransactionInterceptor)
  deleteFaculty(@Body() faculty: any): Promise<any> {
    return this.facultyService.delete(faculty);
  }
}
