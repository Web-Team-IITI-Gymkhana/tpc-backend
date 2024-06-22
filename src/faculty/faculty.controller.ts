import { Body, Controller, Param, ParseUUIDPipe, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
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
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";

@Controller("faculties")
@ApiTags("Faculty")
@ApiBearerAuth("jwt")
export class FacultyController {
  constructor(private facultyService: FacultyService) {}

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
  @GetValues(FacultyQueryDto, GetFacultiesDto)
  async getFaculties(@Query("q") where: FacultyQueryDto) {
    const ans = await this.facultyService.getFaculties(where);

    return pipeTransformArray(ans, GetFacultiesDto);
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
  @GetValue(GetFacultyDto)
  async getFaculty(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.facultyService.getFaculty(id);

    return pipeTransform(ans, GetFacultyDto);
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  @PostValues(CreateFacultiesDto)
  async createFaculties(@Body(createArrayPipe(CreateFacultiesDto)) faculties: CreateFacultiesDto[]) {
    const ans = await this.facultyService.createFaculties(faculties);

    return ans;
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
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

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  @DeleteValues()
  async deleteFaculties(@Query() query: DeleteValuesDto) {
    const ids = query.id;
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.facultyService.deleteFaculties(pids);

    return ans;
  }
}
