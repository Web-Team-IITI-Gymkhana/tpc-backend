import { Module } from "@nestjs/common";
import { ClashesController } from "./clashes.controller";
import { ClashesService } from "./clashes.service";

@Module({
  controllers: [ClashesController],
  providers: [ClashesService],
})
export class ClashesModule {}
