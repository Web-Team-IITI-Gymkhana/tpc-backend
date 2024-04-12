import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RegistrationsService } from "./registrations.service";
import { RegistrationsQueryDto } from "./dtos/query.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { RegistrationReturnDto } from "./dtos/get.dto";
import { CreateRegistrationDto } from "./dtos/post.dto";

@Controller("registrations")
@ApiTags("Registrations")
export class RegistrationsController {
  constructor(private registrationsService: RegistrationsService) {}

  @Get()
  async getRegistrations(@Query("q") where: RegistrationsQueryDto) {
    const ans = await this.registrationsService.getRegistrations(where);

    return pipeTransformArray(ans, RegistrationReturnDto);
  }

  @Post()
  async createRegistrations(@Body(createArrayPipe(CreateRegistrationDto)) registrations: CreateRegistrationDto[]) {
    const ans = await this.registrationsService.createRegistrations(registrations);

    return ans;
  }

  @Delete()
  async deleteRegistrations(@Query("id") ids: string | string[]) {
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.registrationsService.deleteRegistrations(pids);

    return ans;
  }
}
