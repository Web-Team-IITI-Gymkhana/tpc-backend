import { Body, Controller, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PenaltyService } from "./penalty.service";
import { DeleteValues, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { PenaltyQueryDto } from "./dtos/query.dto";
import { GetPenaltiesDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { CreatePenaltiesDto } from "./dtos/post.dto";
import { UpdatePenaltiesDto } from "./dtos/patch.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";

@Controller("penalties")
@ApiTags("Penalty")
@ApiBearerAuth("jwt")
export class PenaltyController {
  constructor(private penaltyService: PenaltyService) {}

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
  @GetValues(PenaltyQueryDto, GetPenaltiesDto)
  async getPenalties(@Query("q") where: PenaltyQueryDto) {
    const ans = await this.penaltyService.getPenalties(where);

    return pipeTransformArray(ans, GetPenaltiesDto);
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  @PostValues(CreatePenaltiesDto)
  async createPenalties(@Body(createArrayPipe(CreatePenaltiesDto)) penalties: CreatePenaltiesDto[]) {
    const ans = await this.penaltyService.createPenalties(penalties);

    return ans;
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  @PatchValues(UpdatePenaltiesDto)
  async updatePenalties(@Body(createArrayPipe(UpdatePenaltiesDto)) penalties: UpdatePenaltiesDto[]) {
    const pr = penalties.map((penalty) => this.penaltyService.updatePenalty(penalty));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  @DeleteValues()
  async deletePenalties(@Query() query: DeleteValuesDto) {
    const ans = await this.penaltyService.deletePenalties(query.id);

    return ans;
  }
}
