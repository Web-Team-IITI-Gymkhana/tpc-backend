import { Body, Controller, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OfferService } from "./offer.service";
import { GetValues, PostValues, PatchValues, DeleteValues } from "src/decorators/controller";
import { pipeTransformArray, createArrayPipe } from "src/utils/utils";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { GetOffCampusOffersDto } from "./dtos/get.dto";
import { UpdateOffCampusOffersDto } from "./dtos/patch.dto";
import { CreateOffCampusOffersDto } from "./dtos/post.dto";
import { OffCampusOffersQueryDto } from "./dtos/query.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";

@Controller("off-campus-offers")
@ApiTags("Offer")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
export class OffCampusOfferController {
  constructor(private offerService: OfferService) {}

  @GetValues(OffCampusOffersQueryDto, GetOffCampusOffersDto)
  async getOffCampusOffers(@Query("q") where: OffCampusOffersQueryDto) {
    const ans = await this.offerService.getOffCampusOffers(where);

    return pipeTransformArray(ans, GetOffCampusOffersDto);
  }

  @PostValues(CreateOffCampusOffersDto)
  async createOffCampusOffers(@Body(createArrayPipe(CreateOffCampusOffersDto)) offers: CreateOffCampusOffersDto[]) {
    const ans = await this.offerService.createOffCampusOffers(offers);

    return ans;
  }

  @PatchValues(UpdateOffCampusOffersDto)
  async updateOffCampusOffers(@Body(createArrayPipe(UpdateOffCampusOffersDto)) offers: UpdateOffCampusOffersDto[]) {
    const pr = offers.map((offer) => this.offerService.updateOffCampusOffer(offer));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @DeleteValues()
  async deleteOffCampusOffers(@Query() query: DeleteValuesDto) {
    const ans = await this.offerService.deleteOffCampusOffers(query.id);

    return ans;
  }
}
