import { Controller, Get, Post, Delete, Query, Body } from "@nestjs/common";
import { ProgramService } from "./program.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProgramsQueryDto } from "./dtos/query.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { GetProgramsDto } from "./dtos/get.dto";
import { CreateProgramsDto } from "./dtos/post.dto";

@Controller("programs")
@ApiTags("Programs")
export class ProgramController {
  constructor(private programService: ProgramService) {}

  @Get()
  @ApiOperation({ description: "Refer to ProgramsQueryDto for schema." })
  @ApiResponse({ type: GetProgramsDto, isArray: true })
  async getPrograms(@Query("q") where: ProgramsQueryDto) {
    const ans = await this.programService.getPrograms(where);

    return pipeTransformArray(ans, GetProgramsDto);
  }

  @Post()
  @ApiBody({ type: CreateProgramsDto, isArray: true })
  async createPrograms(@Body(createArrayPipe(CreateProgramsDto)) programs: CreateProgramsDto[]) {
    const ans = await this.programService.createPrograms(programs);

    return ans;
  }

  @Delete()
  async deletePrograms(@Query("id") ids: string | string[]) {
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.programService.deletePrograms(pids);

    return ans;
  }
}
