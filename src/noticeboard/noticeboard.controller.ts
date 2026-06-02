import {
    Body,
    Controller,
    Get,
    Post,
    Query,
} from "@nestjs/common";
import { NoticeboardService } from "./noticeboard.service";
import { CreateAnnouncementDto } from "./dtos/create.dtos";
import { QueryAnnouncementDto } from "./dtos/query.dtos";

@Controller("")
export class NoticeboardController {
    constructor(
        private readonly noticeboardService: NoticeboardService
    ) { }

    @Get("notification")
    async getAll(
        @Query() queryDto: QueryAnnouncementDto
    ) {
        return await this.noticeboardService.getAnnouncements(
            queryDto
        );
    }

    @Post("announce")
    async create(
        @Body() createAnnouncementDto: CreateAnnouncementDto
    ) {
        return await this.noticeboardService.createAnnouncement(
            createAnnouncementDto
        );
    }
}