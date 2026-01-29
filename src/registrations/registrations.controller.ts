import { Body, Controller, HttpException, HttpStatus, Patch, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RegistrationsService } from "./registrations.service";
import { DeleteValues, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { RegistrationsQueryDto } from "./dtos/query.dto";
import { GetRegistrationsDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { CreateRegistrationsDto } from "./dtos/post.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { IUser } from "src/auth/User";
import { User } from "src/decorators/User";
import { RoleEnum } from "src/enums";

@Controller("registrations")
@ApiTags("Registration")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
export class RegistrationsController {
  constructor(private registrationsService: RegistrationsService) {}
  @GetValues(RegistrationsQueryDto, GetRegistrationsDto)
  async getRegistrations(@Query("q") where: RegistrationsQueryDto) {
    const ans = await this.registrationsService.getRegistrations(where);

    return pipeTransformArray(ans, GetRegistrationsDto);
  }
  @PostValues(CreateRegistrationsDto)
  async createRegistrations(@Body(createArrayPipe(CreateRegistrationsDto)) registrations: CreateRegistrationsDto[]) {
    return await this.registrationsService.createRegistrations(registrations);
  }
  @DeleteValues()
  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  async deleteRegistrations(@Query() query: DeleteValuesDto) {
    return await this.registrationsService.deleteRegistrations(query.id);
  }
  @PatchValues(CreateRegistrationsDto)
  async updateRegistrations(
    @Body(createArrayPipe(CreateRegistrationsDto)) registrations: CreateRegistrationsDto[]
  ): Promise<string[]> {
    return await this.registrationsService.createRegistrations(registrations);
  }
}
