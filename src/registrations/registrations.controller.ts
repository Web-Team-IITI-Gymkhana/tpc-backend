import { Body, Controller, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RegistrationsService } from "./registrations.service";
import { DeleteValues, GetValues, PostValues } from "src/decorators/controller";
import { RegistrationsQueryDto } from "./dtos/query.dto";
import { GetRegistrationsDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { CreateRegistrationsDto } from "./dtos/post.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard } from "src/auth/adminGaurd";

@Controller("registrations")
@ApiTags("Registration")
@ApiBearerAuth("jwt")
export class RegistrationsController {
  constructor(private registrationsService: RegistrationsService) {}

  @UseGuards(AuthGuard("jwt"), AdminGuard)
  @GetValues(RegistrationsQueryDto, GetRegistrationsDto)
  async getRegistrations(@Query("q") where: RegistrationsQueryDto) {
    const ans = await this.registrationsService.getRegistrations(where);

    return pipeTransformArray(ans, GetRegistrationsDto);
  }

  @UseGuards(AuthGuard("jwt"), AdminGuard)
  @PostValues(CreateRegistrationsDto)
  async createRegistrations(@Body(createArrayPipe(CreateRegistrationsDto)) registrations: CreateRegistrationsDto[]) {
    const ans = await this.registrationsService.createRegistrations(registrations);

    return ans;
  }

  @UseGuards(AuthGuard("jwt"), AdminGuard)
  @DeleteValues()
  async deleteRegistrations(@Query() query: DeleteValuesDto) {
    const ans = await this.registrationsService.deleteRegistrations(query.id);

    return ans;
  }
}
