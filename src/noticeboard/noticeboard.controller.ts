import { Controller, Get, Post, Body } from "@nestjs/common";
import { NoticeboardService } from "./noticeboard.service";
import { CreateAnnouncementDto } from "./dtos/create.dtos";

@Controller()
export class NoticeboardController {
    constructor(private readonly service: NoticeboardService) { }

    @Get("notification")
    getAll() {
        return this.service.getAnnouncements();
    }

    @Post("announce")
    create(@Body() dto: CreateAnnouncementDto) {
        return this.service.createAnnouncement(dto);
    }
}