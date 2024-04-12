import { Controller, Get, UseGuards } from "@nestjs/common";
import { StudentOfferService } from "./offer.service";
import { User } from "src/decorators/User";
import { IUser } from "src/auth/User";
import { pipeTransformArray } from "src/utils/utils";
import { OffCampusOfferReturnDto } from "./dtos/getOff.dto";
import { AuthGuard } from "@nestjs/passport";
import { OnCampusOfferReturnDto } from "./dtos/getOn.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("/student-view/offers") //Student only.
@ApiTags("Student View")
@UseGuards(AuthGuard("jwt"))
export class StudentOfferController {
  constructor(private studentOfferService: StudentOfferService) {}

  @Get("/on")
  @ApiResponse({ type: OnCampusOfferReturnDto, isArray: true })
  async getOnCampusOffers(@User() user: IUser) {
    const ans = await this.studentOfferService.getOnCampusOffers(user.studentId);

    return pipeTransformArray(ans, OnCampusOfferReturnDto);
  }

  @Get("/off")
  @ApiResponse({ type: OffCampusOfferReturnDto, isArray: true })
  async getOffCampusOffers(@User() user: IUser) {
    const ans = await this.studentOfferService.getOffCampusOffer(user.studentId);

    return pipeTransformArray(ans, OffCampusOfferReturnDto);
  }
}
