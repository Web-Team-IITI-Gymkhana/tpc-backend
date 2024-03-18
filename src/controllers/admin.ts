import { Controller, Inject, UseInterceptors, ClassSerializerInterceptor, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { PROGRAM_SERVICE } from "src/constants";

import ProgramService from "src/services/ProgramService";

@Controller("/admin")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class AdminController {
  constructor(@Inject(PROGRAM_SERVICE) private programService: ProgramService) {}

  @Get("/programs")
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllProgramsOffered() {
    const programs = await this.programService.getPrograms();

    return { programs: programs };
  }
}
