import { Body, Controller, Param, ParseUUIDPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FacultyService } from "./faculty.service";
import { DeleteValues, GetValue, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { FacultyQueryDto } from "./dtos/query.dto";
import { GetFacultiesDto, GetFacultyDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { CreateFacultiesDto } from "./dtos/post.dto";
import { UpdateFacultiesDto } from "./dtos/patch.dto";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { DeleteValuesDto } from "src/utils/utils.dto";

@Controller("faculties")
@ApiTags("Faculty")
export class FacultyController {
  constructor(private facultyService: FacultyService) {}

  @GetValues(FacultyQueryDto, GetFacultiesDto)
  async getFaculties(@Query("q") where: FacultyQueryDto) {
    const ans = await this.facultyService.getFaculties(where);

    return pipeTransformArray(ans, GetFacultiesDto);
  }

  @GetValue(GetFacultyDto)
  async getFaculty(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.facultyService.getFaculty(id);

    return pipeTransform(ans, GetFacultyDto);
  }

  @PostValues(CreateFacultiesDto)
  async createFaculties(@Body(createArrayPipe(CreateFacultiesDto)) faculties: CreateFacultiesDto[]) {
    const ans = await this.facultyService.createFaculties(faculties);

    return ans;
  }

  @PatchValues(UpdateFacultiesDto)
  @UseInterceptors(TransactionInterceptor)
  async updateFaculties(
    @Body(createArrayPipe(UpdateFacultiesDto)) faculties: UpdateFacultiesDto[],
    @TransactionParam() t: Transaction
  ) {
    const pr = faculties.map((faculty) => this.facultyService.updateFaculty(faculty, t));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @DeleteValues()
  async deleteFaculties(@Query() query: DeleteValuesDto) {
    const ids = query.id;
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.facultyService.deleteFaculties(pids);

    return ans;
  }
}
