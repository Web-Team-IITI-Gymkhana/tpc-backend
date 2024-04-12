import { Module } from "@nestjs/common";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { defaultOptions } from "class-transformer/types/constants/default-options.constant";

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
