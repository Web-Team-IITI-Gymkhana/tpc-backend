import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { isProductionEnv } from "../utils/utils";
import { Logger } from "@nestjs/common";
import config from "./config";

console.log(isProductionEnv);
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      models: config.models,
      logging: isProductionEnv() ? false : (msg) => Logger.debug(msg),
      pool: {
        max: 5,
        min: 1,
        acquire: 30000,
        idle: 10000,
      },
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
