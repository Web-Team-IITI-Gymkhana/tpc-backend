import { Body, Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OfferService } from "./offer.service";
import { DeleteValues, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { OnCampusOffersQueryDto } from "./dtos/query.dto";
import { GetOnCampusOffersDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { CreateOnCampusOffersDto } from "./dtos/post.dto";
import { UpdateOnCampusOffersDto } from "./dtos/patch.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";
import { GetStudentSalariesDto } from "src/student-view/salary/dtos/get.dto";

@Controller("on-campus-offers")
@ApiTags("Offer")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
@ApiBearerAuth("jwt")
export class OnCampusOfferController {
  constructor(private offerService: OfferService) {}

  @GetValues(OnCampusOffersQueryDto, GetOnCampusOffersDto)
  async getOnCampusOffers(@Query("q") where: OnCampusOffersQueryDto) {
    const ans = await this.offerService.getOnCampusOffers(where);

    return pipeTransformArray(ans, GetOnCampusOffersDto);
  }

  @PostValues(CreateOnCampusOffersDto)
  async createOnCampusOffers(@Body(createArrayPipe(CreateOnCampusOffersDto)) offers: CreateOnCampusOffersDto[]) {
    const ans = await this.offerService.createOnCampusOffers(offers);

    return ans;
  }

  @Get("salaries/:jobId/student/:studentId")
  @ApiResponse({ type: GetStudentSalariesDto })
  async getSalaries(@Param("jobId") jobId: string, @Param("studentId") studentId: string) {
    const ans = await this.offerService.getSalaries(jobId, studentId);

    return pipeTransformArray(ans, GetStudentSalariesDto);
  }

  @Get("job/:jobId")
  @ApiResponse({ type: GetOnCampusOffersDto })
  async getOffersByJob(@Param("jobId") jobId: string) {
    const ans = await this.offerService.getOffersByJob(jobId);

    return pipeTransformArray(ans, GetOnCampusOffersDto);
  }

  @PatchValues(UpdateOnCampusOffersDto)
  async updateOnCampusOffers(@Body(createArrayPipe(UpdateOnCampusOffersDto)) offers: UpdateOnCampusOffersDto[]) {
    const pr = offers.map((offer) => this.offerService.updateOnCampusOffer(offer));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @DeleteValues()
  async deleteOnCampusOffers(@Query() query: DeleteValuesDto) {
    const ans = await this.offerService.deleteOnCampusOffers(query.id);

    return ans;
  }
}
