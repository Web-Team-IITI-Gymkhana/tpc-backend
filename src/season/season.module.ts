import { Module } from "@nestjs/common";
import { SeasonController } from "./season.controller";
import { SeasonService } from "./season.service";
import { FileService } from "src/services/FileService";

@Module({
  controllers: [SeasonController],
  providers: [SeasonService, FileService],
})
export class SeasonModule {}
