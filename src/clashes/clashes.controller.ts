import { Controller, Get, Param, ParseUUIDPipe } from "@nestjs/common";
import { ClashesService } from "./clashes.service";
import { pipeTransformArray } from "src/utils/utils";
import { ApiBearerAuth, ApiTags, ApiResponse } from "@nestjs/swagger";
import { ClashApplicationDto, ClashJobDto } from "./dtos/get.dto";

@Controller("clashes")
@ApiTags("Clashes")
// @ApiBearerAuth("jwt")
export class ClashesController {
  constructor(private clashesService: ClashesService) {}

  @Get("/jobs")
  @ApiResponse({ type: ClashJobDto })
  async getJobs() {
    const jobs = await this.clashesService.getJobs();

    return pipeTransformArray(jobs, ClashJobDto);
  }

  @Get("/:id")
  @ApiResponse({ type: ClashApplicationDto })
  async getclashes(@Param("id", ParseUUIDPipe) id: string) {
    const ans = await this.clashesService.getclashes(id);

    return pipeTransformArray(ans, ClashApplicationDto);
  }
}
