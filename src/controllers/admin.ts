import { Controller, Inject, UseInterceptors, ClassSerializerInterceptor, Get } from "@nestjs/common";
import { PROGRAM_SERVICE } from "src/constants";

import ProgramService from "src/services/ProgramService";

@Controller("/admin")
export class AdminController {
  constructor(@Inject(PROGRAM_SERVICE) private programService: ProgramService) {}

  @Get("/programs")
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllProgramsOffered() {
    const programs = await this.programService.getPrograms();
    return { programs: programs };
  }
}
