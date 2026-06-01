import { Body, Controller, Post } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller("api/v1")
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post("verifyadmin")
    async verifyAdmin(@Body("email") email: string) {
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail) {
            return {
                authorized: false,
                message: "Email is required.",
            };
        }

        const isAdmin = await this.adminService.isAdmin(normalizedEmail);

        return {
            authorized: isAdmin,
            message: isAdmin
                ? "Admin verified successfully."
                : "You are not authorized.",
        };
    }
}