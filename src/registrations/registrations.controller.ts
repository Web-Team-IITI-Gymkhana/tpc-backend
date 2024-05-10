import { Body, Controller, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RegistrationsService } from "./registrations.service";
import { DeleteValues, GetValues, PostValues } from "src/decorators/controller";
import { RegistrationsQueryDto } from "./dtos/query.dto";
import { GetRegistrationsDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { CreateRegistrationsDto } from "./dtos/post.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";

@Controller("registrations")
@ApiTags("Registration")
export class RegistrationsController {
  constructor(private registrationsService: RegistrationsService) {}

  @GetValues(RegistrationsQueryDto, GetRegistrationsDto)
  async getRegistrations(@Query("q") where: RegistrationsQueryDto) {
    const ans = await this.registrationsService.getRegistrations(where);

    return pipeTransformArray(ans, GetRegistrationsDto);
  }

  @PostValues(CreateRegistrationsDto)
  async createRegistrations(@Body(createArrayPipe(CreateRegistrationsDto)) registrations: CreateRegistrationsDto[]) {
    const ans = await this.registrationsService.createRegistrations(registrations);

    return ans;
  }

  @DeleteValues()
  async deleteRegistrations(@Query() query: DeleteValuesDto) {
    const ans = await this.registrationsService.deleteRegistrations(query.id);

    return ans;
  }
}
