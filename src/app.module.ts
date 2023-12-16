import { Module } from "@nestjs/common";
import { appController } from "./app.controller";
import { appService } from "./app.service";
import { adminModule } from "./admin/admin.module";
import { databaseModule } from "./db/database.module";
import { tpcModule } from "./TPC/TPC.module";

@Module({
  imports: [adminModule, tpcModule, databaseModule],
  controllers: [appController],
  providers: [appService],
})
export class appModule {}
