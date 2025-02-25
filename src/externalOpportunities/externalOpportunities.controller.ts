import { Controller, Body, UseGuards, Query, UseInterceptors, Res, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DeleteValues, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { ExternalOpportunitiesService } from "./externalOpportunities.service";
import { Transaction } from "sequelize";
import { TransactionParam } from "src/decorators/TransactionParam";
import { pipeTransformArray, createArrayPipe } from "src/utils/utils";
import { GetExternalOpportunitiesDto } from "./dtos/get.dto";
import { ExternalOpportunitiesQueryDto } from "./dtos/query.dto";
import { PostExternalOpportunitiesDto } from "./dtos/post.dto";
import { PatchExternalOpportunitiesDto } from "./dtos/patch.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { Response } from "express";

@Controller("external-opportunities")
@ApiTags("ExternalOpportunities")
@ApiBearerAuth("jwt")
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
    @Body(createArrayPipe(PostExternalOpportunitiesDto)) externalOpportunities: PostExternalOpportunitiesDto[],
    @Res({ passthrough: true }) res: Response,
    @TransactionParam() t: Transaction
  ) {
    try {
      await this.externalOpportunitiesService.createExternalOpportunities(externalOpportunities, t);
      res.status(HttpStatus.OK);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  @PatchValues(PatchExternalOpportunitiesDto)
  @UseInterceptors(TransactionInterceptor)
  async updateExternalOpportunity(
    @Body(createArrayPipe(PatchExternalOpportunitiesDto)) externalOpportunities: PatchExternalOpportunitiesDto[],
    @TransactionParam() t: Transaction,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      await this.externalOpportunitiesService.createExternalOpportunities(externalOpportunities, t);
      res.status(HttpStatus.OK);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
  @UseInterceptors(TransactionInterceptor)
  @DeleteValues()
  async deleteExternalOpportunity(@Query() query: DeleteValuesDto, @TransactionParam() t: Transaction) {
    const ids = query.id;
    const pids = typeof ids === "string" ? [ids] : ids;

    return await this.externalOpportunitiesService.deleteExternalOpportunities(pids, t);
  }
}
