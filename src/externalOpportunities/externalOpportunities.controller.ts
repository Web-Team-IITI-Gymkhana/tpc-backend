import { Controller, Body, UseGuards, Query, UseInterceptors, HttpCode } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DeleteValues, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { ExternalOpportunitiesService } from "./externalOpportunities.service";
import { Transaction } from "sequelize";
import { TransactionParam } from "src/decorators/TransactionParam";
import { pipeTransformArray, createArrayPipe } from "src/utils/utils";
import { GetExternalOpportunitiesDto } from "./dtos/get.dto";
import { ExternalOpportunitiesQueryDto } from "./dtos/query.dto";
import { PostExternalOpportunitiesDto } from "./dtos/post.dto";
import { UpdateExternalOpportunitiesDto } from "./dtos/patch.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";

@Controller("external-opportunities")
@ApiTags("ExternalOpportunities")
export class ExternalOpportunitiesController {
  constructor(private externalOpportunitiesService: ExternalOpportunitiesService) {}

  @GetValues(ExternalOpportunitiesQueryDto, GetExternalOpportunitiesDto)
  async getExternalOpportunities(@Query("q") where: ExternalOpportunitiesQueryDto) {
    const ans = await this.externalOpportunitiesService.getExternalOpportunities(where);

    return pipeTransformArray(ans, GetExternalOpportunitiesDto);
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  @PostValues(PostExternalOpportunitiesDto)
  async createExternalOpportunity(
    @Body(createArrayPipe(PostExternalOpportunitiesDto)) externalOpportunities: PostExternalOpportunitiesDto[]
  ) {
    return await this.externalOpportunitiesService.createExternalOpportunities(externalOpportunities);
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  @PatchValues(PostExternalOpportunitiesDto)
  @UseInterceptors(TransactionInterceptor)
  async updateExternalOpportunity(
    @Body(createArrayPipe(PostExternalOpportunitiesDto)) externalOpportunities: PostExternalOpportunitiesDto[],
    @TransactionParam() t: Transaction
  ): Promise<string[]> {
    return await this.externalOpportunitiesService.createExternalOpportunities(externalOpportunities);
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  @DeleteValues()
  async deleteExternalOpportunity(@Query() query: DeleteValuesDto) {
    const ids = query.id;
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.externalOpportunitiesService.deleteExternalOpportunities(pids);

    return ans;
  }
}
