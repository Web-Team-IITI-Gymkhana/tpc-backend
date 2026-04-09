import { Controller, Post, Body } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller() 
export class AdminController {
    constructor(private readonly service: AdminService) { }

    @Post("verifyadmin")
    async verify(@Body("email") email: string) {
        const isAdmin = await this.service.isAdmin(email);
        return { authorized: isAdmin };
    }
}