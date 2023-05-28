import { Sequelize } from 'sequelize-typescript';
import { Logger } from '@nestjs/common';

import { isProductionEnv } from '../utils/utils';
import { authModel } from './models/auth';
import { studentModel } from './models/student';
import { companyModel } from './models/company';
import { jobModel } from './models/job';
import { offerModel } from './models/offer';
import { statusModel } from './models/status';
import { jobEligibility } from './models/jobElegibility';
import { seasonModel } from './models/season';
import { contactModel } from './models/contact';
import { eventModel } from './models/event';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const dbName = process.env.DB_NAME as string;
      const dbUser = process.env.DB_USERNAME as string;
      const dbHost = process.env.DB_HOST;
      const dbDriver = 'postgres';
      const dbPassword = process.env.DB_PASSWORD as string;
      const dbPort = Number(process.env.DB_PORT);
      const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
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
      sequelize.addModels([
        jobEligibility,
        authModel,
        studentModel,
        companyModel,
        jobModel,
        offerModel,
        statusModel,
        seasonModel,
        eventModel,
        contactModel,
      ]);
      await sequelize.sync({ force: true });
      return sequelize;
    },
  },
];

// export const spacesProviders = [
//   {
//     provide: USER_DAO,
//     useValue: UserModel,
//   },
// ];
