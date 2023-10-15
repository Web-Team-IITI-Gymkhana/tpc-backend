import { Sequelize } from "sequelize-typescript";
import { Logger } from "@nestjs/common";
import { isProductionEnv } from "../utils/utils";
import { companyModel } from "./models/company";
import { eligibleRolesModel } from "./models/eligibleRoles";
import { eventModel } from "./models/event";
import { facultyCoordinatorApprovalModel } from "./models/facultyCoordinatorApproval";
import { facultyCoordinatorModel } from "./models/facultyCoordinator";
import { jafModel } from "./models/jaf";
import { memberModel } from "./models/member";
import { onCampusOfferModel } from "./models/onCampusOffer";
import { penaltiesModel } from "./models/penalties";
import { ppOfferModel } from "./models/ppoOffer";
import { rolesOfferedModel } from "./models/rolesOffered";
import { roundsModel } from "./models/rounds";
import { seasonModel } from "./models/season";
import { studentModel } from "./models/student";
import { tpcCoordinatorModel } from "./models/tpcCoordinator";

let sequelizeInstance: Sequelize | null = null;

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async () => {
      if (!sequelizeInstance) {
        const dbName = process.env.DB_NAME as string;
        const dbUser = process.env.DB_USERNAME as string;
        const dbHost = process.env.DB_HOST;
        const dbDriver = "postgres";
        const dbPassword = process.env.DB_PASSWORD as string;
        const dbPort = Number(process.env.DB_PORT);
        sequelizeInstance = new Sequelize(dbName, dbUser, dbPassword, {
          host: dbHost,
          dialect: dbDriver,
          port: dbPort,
          logging: isProductionEnv() ? false : (msg) => Logger.debug(msg),
          pool: {
            max: 5,
            min: 1,
            acquire: 30000,
            idle: 10000,
          },
        });
        sequelizeInstance.addModels([
          companyModel,
          eligibleRolesModel,
          eventModel,
          facultyCoordinatorApprovalModel,
          facultyCoordinatorModel,
          jafModel,
          memberModel,
          onCampusOfferModel,
          penaltiesModel,
          ppOfferModel,
          rolesOfferedModel,
          roundsModel,
          seasonModel,
          studentModel,
          tpcCoordinatorModel,
        ]);
      }
      await sequelizeInstance.sync({ force: true }).then(async () => {
        console.log("Database & tables created!");
      });
      return sequelizeInstance;
    },
  },
];

export { sequelizeInstance };
