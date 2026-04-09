import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class AdminService {
    constructor(@InjectModel("Admin") private model: Model<any>) { }

    async isAdmin(email: string): Promise<boolean> {
        const admin = await this.model.findOne({ email });
        return !!admin;
    }
}