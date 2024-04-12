import { Module } from "@nestjs/common";
import { StudentOfferController } from "./offer.controller";
import { StudentOfferService } from "./offer.service";

@Module({
  controllers: [StudentOfferController],
  providers: [StudentOfferService],
})
export class StudentOfferModule {}
