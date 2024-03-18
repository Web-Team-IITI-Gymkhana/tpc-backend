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
import OnCampusOfferService from "src/services/OnCampusOfferService";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { OnCampusOffer } from "src/entities/OnCampusOffer";
import { updateOrFind } from "src/utils/utils";
import {
  CreateOnCampusOffersDto,
  OnCampusOfferIdParamDto,
  OnCampusOfferQueryDto,
  UpdateOnCampusOfferDto,
} from "src/dtos/onCampusOffer";
import { ON_CAMPUS_OFFER_SERVICE } from "src/constants";

@Controller("/onCampusOffers")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class OnCampusOfferController {
  constructor(@Inject(ON_CAMPUS_OFFER_SERVICE) private onCampusOfferService: OnCampusOfferService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getOnCampusOffers(@Query() query: OnCampusOfferQueryDto) {
    const onCampusOffers = await this.onCampusOfferService.getOnCampusOffers({
      studentId: query.studentId,
      salaryId: query.salaryId,
      status: query.status,
      id: query.id,
    });

    return { onCampusOffers: onCampusOffers };
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async createOnCampusOffers(@Body() body: CreateOnCampusOffersDto, @TransactionParam() t: Transaction) {
    const promises = [];
    for (const onCampusOffer of body.onCampusOffers) {
      promises.push(
        this.onCampusOfferService.createOrGetOnCampusOffer(
          new OnCampusOffer({
            studentId: onCampusOffer.studentId,
            salaryId: onCampusOffer.salaryId,
            status: onCampusOffer.status,
          }),
          t
        )
      );
    }
    const onCampusOffers = await Promise.all(promises);

    return { onCampusOffers: onCampusOffers };
  }

  @Put("/:onCampusOfferId")
  @UseInterceptors(ClassSerializerInterceptor)
  async updateOnCampusOffer(@Param() param: OnCampusOfferIdParamDto, @Body() body: UpdateOnCampusOfferDto) {
    const [onCampusOffer] = await this.onCampusOfferService.getOnCampusOffers({ id: param.onCampusOfferId });
    if (!onCampusOffer) {
      throw new HttpException(
        `OnCampusOffer with OnCampusOfferId: ${param.onCampusOfferId} not found`,
        HttpStatus.NOT_FOUND
      );
    }

    const newOnCampusOffer = await updateOrFind(
      param.onCampusOfferId,
      body,
      this.onCampusOfferService,
      "updateOnCampusOffer",
      "getOnCampusOffers"
    );

    return { onCampusOffer: newOnCampusOffer };
  }

  @Delete("/:onCampusOfferId")
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteOnCampusOffer(@Param() param: OnCampusOfferIdParamDto) {
    const [onCampusOffer] = await this.onCampusOfferService.getOnCampusOffers({ id: param.onCampusOfferId });
    if (!onCampusOffer) {
      throw new HttpException(
        `OnCampusOffer with OnCampusOfferId: ${param.onCampusOfferId} not found`,
        HttpStatus.NOT_FOUND
      );
    }
    const deleted = await this.onCampusOfferService.deleteOnCampusOffer(param.onCampusOfferId);

    return { deleted: deleted };
  }
}
