import { Body, Controller, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PenaltyService } from "./penalty.service";
import { DeleteValues, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { PenaltyQueryDto } from "./dtos/query.dto";
import { GetPenaltiesDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { CreatePenaltiesDto } from "./dtos/post.dto";
import { UpdatePenaltiesDto } from "./dtos/patch.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";

@Controller("penalties")
@ApiTags("Penalty")
export class PenaltyController {
  constructor(private penaltyService: PenaltyService) {}

  @GetValues(PenaltyQueryDto, GetPenaltiesDto)
  async getPenalties(@Query("q") where: PenaltyQueryDto) {
    const ans = await this.penaltyService.getPenalties(where);

    return pipeTransformArray(ans, GetPenaltiesDto);
  }

  @PostValues(CreatePenaltiesDto)
  async createPenalties(@Body(createArrayPipe(CreatePenaltiesDto)) penalties: CreatePenaltiesDto[]) {
    const ans = await this.penaltyService.createPenalties(penalties);

    return ans;
  }

  @PatchValues(UpdatePenaltiesDto)
  async updatePenalties(@Body(createArrayPipe(UpdatePenaltiesDto)) penalties: UpdatePenaltiesDto[]) {
    const pr = penalties.map((penalty) => this.penaltyService.updatePenalty(penalty));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @DeleteValues()
  async deletePenalties(@Query() query: DeleteValuesDto) {
    const ans = await this.penaltyService.deletePenalties(query.id);

    return ans;
  }
}
