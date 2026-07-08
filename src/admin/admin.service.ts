import { Inject, Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { ADMIN_DAO } from "src/constants";
import { AdminModel } from "src/db/models";

@Injectable()
export class AdminService {
    constructor(
        @Inject(ADMIN_DAO)
        private readonly adminRepository: typeof AdminModel
    ) { }

    async isAdmin(email: string): Promise<boolean> {
        const admin = await this.adminRepository.findOne({
            where: {
                email: {
                    [Op.iLike]: email.trim(),
                },
            },
        });

        return !!admin;
    }
}