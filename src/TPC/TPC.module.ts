import { Module } from "@nestjs/common";
import { memberSearchModule } from "./search/memberSearch.module";

@Module({
  imports: [memberSearchModule],
})
export class tpcModule {}
