import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import OffCampusOfferService from "src/services/OffCampusOfferService";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { OffCampusOffer } from "src/entities/OffCampusOffer";
import { UpdateOrFind } from "src/utils/utils";
import {
  CreateOffCampusOffersDto,
  OffCampusOfferIdParamDto,
  OffCampusOfferQueryDto,
  UpdateOffCampusOfferDto,
} from "src/dtos/offCampusOffer";
import { OFF_CAMPUS_OFFER_SERVICE } from "src/constants";

@Controller("/offCampusOffers")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class OffCampusOfferController {
  constructor(@Inject(OFF_CAMPUS_OFFER_SERVICE) private offCampusOfferService: OffCampusOfferService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getOffCampusOffers(@Query() query: OffCampusOfferQueryDto) {
    //Should it be Body instead of query for handling metadata queries?
    const offCampusOffers = await this.offCampusOfferService.getOffCampusOffers({
      id: query.id,
      studentId: query.studentId,
      seasonId: query.seasonId,
      companyId: query.companyId,
      salary: query.salary,
      salaryPeriod: query.salaryPeriod,
      metadata: query.metadata,
      offerType: query.offerType,
      status: query.status,
    });
    return { offCampusOffers: offCampusOffers };
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async createOffCampusOffers(@Body() body: CreateOffCampusOffersDto, @TransactionParam() t: Transaction) {
    const promises = [];
    for (const offCampusOffer of body.offCampusOffers) {
      promises.push(
        this.offCampusOfferService.createOrGetOffCampusOffer(
          new OffCampusOffer({
            studentId: offCampusOffer.studentId,
            seasonId: offCampusOffer.seasonId,
            companyId: offCampusOffer.companyId,
            salary: offCampusOffer.salary,
            salaryPeriod: offCampusOffer.salaryPeriod,
            metadata: offCampusOffer.metadata,
            offerType: offCampusOffer.offerType,
            status: offCampusOffer.status,
          }),
          t
        )
      );
    }
    const offCampusOffers = await Promise.all(promises);
    return { offCampusOffers: offCampusOffers };
  }

  @Put("/:offCampusOfferId")
  @UseInterceptors(ClassSerializerInterceptor)
  async updateOffCampusOffer(@Param() param: OffCampusOfferIdParamDto, @Body() body: UpdateOffCampusOfferDto) {
    const [offCampusOffer] = await this.offCampusOfferService.getOffCampusOffers({ id: param.offCampusOfferId });
    if (!offCampusOffer) {
      throw new HttpException(
        `OffCampusOffer with OffCampusOfferId: ${param.offCampusOfferId} not found`,
        HttpStatus.NOT_FOUND
      );
    }

    const newOffCampusOffer = await UpdateOrFind(
      param.offCampusOfferId,
      body,
      this.offCampusOfferService,
      "updateOffCampusOffer",
      "getOffCampusOffers"
    );
    return { offCampusOffer: newOffCampusOffer };
  }

  @Delete("/:offCampusOfferId")
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteOffCampusOffer(@Param() param: OffCampusOfferIdParamDto) {
    const [offCampusOffer] = await this.offCampusOfferService.getOffCampusOffers({ id: param.offCampusOfferId });
    if (!offCampusOffer) {
      throw new HttpException(
        `OffCampusOffer with OffCampusOfferId: ${param.offCampusOfferId} not found`,
        HttpStatus.NOT_FOUND
      );
    }
    const deleted = await this.offCampusOfferService.deleteOffCampusOffer(param.offCampusOfferId);
    return { deleted: deleted };
  }
}
