import { ADMIN_DAO, SEQUELIZE } from "src/constants";
import { AdminModel } from "src/db/models";

export const adminProviders = [
    {
        provide: ADMIN_DAO,
        useFactory: (sequelize) => {
            return sequelize.model(AdminModel);
        },
        inject: [SEQUELIZE],
    },
];