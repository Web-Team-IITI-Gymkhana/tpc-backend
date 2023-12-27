import { Module } from "@nestjs/common";
import { databaseProviders, spacesProviders } from "./database.providers";

@Module({
  providers: [...databaseProviders, ...spacesProviders],
  exports: [...databaseProviders, ...spacesProviders],
})
export class DatabaseModule {}
