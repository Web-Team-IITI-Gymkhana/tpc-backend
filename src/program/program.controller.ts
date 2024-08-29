import { Body, Controller, Query, UseGuards } from "@nestjs/common";
import { ProgramService } from "./program.service";
import { DeleteValues, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { ProgramsQueryDto } from "./dtos/query.dto";
import { GetProgramsDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { CreateProgramsDto } from "./dtos/post.dto";
import { UpdateProgramsDto } from "./dtos/patch.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";

@Controller("programs")
@ApiTags("Program")
@ApiBearerAuth("jwt")
export class ProgramController {
  constructor(private programService: ProgramService) {}

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
  @GetValues(ProgramsQueryDto, GetProgramsDto)
  async getPrograms(@Query("q") where: ProgramsQueryDto) {
    const ans = await this.programService.getPrograms(where);

    return pipeTransformArray(ans, GetProgramsDto);
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  @PostValues(CreateProgramsDto)
  async createPrograms(@Body(createArrayPipe(CreateProgramsDto)) programs: CreateProgramsDto[]) {
    const ans = await this.programService.createPrograms(programs);

    return ans;
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  @PatchValues(UpdateProgramsDto)
  async updatePrograms(@Body(createArrayPipe(UpdateProgramsDto)) programs: UpdateProgramsDto[]) {
    const pr = programs.map((program) => this.programService.updateProgram(program));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  @DeleteValues()
  async deletePrograms(@Query() query: DeleteValuesDto) {
    const ans = await this.programService.deletePrograms(query.id);

    return ans;
  }
}
