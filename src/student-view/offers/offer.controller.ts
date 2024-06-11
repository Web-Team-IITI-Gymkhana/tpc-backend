import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OfferService } from "./offer.service";
import { GetOffCampusOffersDto, GetOnCampusOffersDto } from "./dtos/get.dto";
import { pipeTransformArray } from "src/utils/utils";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/decorators/User";
import { IUser } from "src/auth/User";

@Controller("student-view/offers")
@UseGuards(AuthGuard("jwt"))
@ApiTags("Student-view/Offer")
@ApiBearerAuth("jwt")
export class OfferController {
  constructor(private offerService: OfferService) {}

  @Get("/off-campus")
  @ApiResponse({ type: GetOffCampusOffersDto, isArray: true })
  async getOffCampusOffers(@User() user: IUser) {
    const ans = await this.offerService.getOffCampusOffers(user.studentId);

    return pipeTransformArray(ans, GetOffCampusOffersDto);
  }

  @Get("/on-campus")
  @ApiResponse({ type: GetOnCampusOffersDto, isArray: true })
  async getOnCampusOffers(@User() user: IUser) {
    const ans = await this.offerService.getOnCampusOffers(user.studentId);

    return pipeTransformArray(ans, GetOnCampusOffersDto);
  }
}
