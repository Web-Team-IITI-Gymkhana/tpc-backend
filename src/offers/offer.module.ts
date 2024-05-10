import { Module } from "@nestjs/common";
import { OnCampusOfferController } from "./onCampusOffer.controller";
import { OfferService } from "./offer.service";
import { OffCampusOfferController } from "./offCampusOffer.controller";

@Module({
  controllers: [OnCampusOfferController, OffCampusOfferController],
  providers: [OfferService],
})
export class OfferModule {}
