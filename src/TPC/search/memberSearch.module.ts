import { Module } from "@nestjs/common";
import { memberSearchService } from "./memberSearch.service";
import { memberSearchController } from "./memberSearch.controller";
import { databaseModule } from "../../db/database.module";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [databaseModule],
  controllers: [memberSearchController],
  providers: [memberSearchService, ConfigService],
})
export class memberSearchModule {}
