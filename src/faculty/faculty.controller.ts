import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FacultyService } from "./faculty.service";
import { createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { GetFacultiesReturnDto, GetFacultyReturnDto } from "./dtos/get.dto";
import { CreateFacultyDto } from "./dtos/post.dto";

@Controller("faculty")
@ApiTags("Faculty")
export class FacultyController {
  constructor(private facultyService: FacultyService) {}

  @Get()
  @ApiResponse({ type: GetFacultiesReturnDto, isArray: true })
  async getFaculties() {
    const ans = await this.facultyService.getFaculties();

    return pipeTransformArray(ans, GetFacultiesReturnDto);
  }

  @Get("/:id")
  @ApiResponse({ type: GetFacultyReturnDto })
  async getFaculty(@Param("id") id: string) {
    const ans = await this.facultyService.getFaculty(id);

    return pipeTransform(ans, GetFacultyReturnDto);
  }

  @Post()
  @ApiBody({ type: CreateFacultyDto, isArray: true })
  async createFaculties(@Body(createArrayPipe(CreateFacultyDto)) faculties: CreateFacultyDto[]) {
    const ans = await this.facultyService.createFaculties(faculties);

    return ans;
  }

  @Delete()
  async deleteFaculties(@Query("id") ids: string | string[]) {
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.facultyService.deleteFaculties(pids);

    return ans;
  }
}
