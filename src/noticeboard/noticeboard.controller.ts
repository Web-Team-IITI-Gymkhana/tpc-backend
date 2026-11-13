import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
    ApiBearerAuth,
    ApiQuery,
    ApiTags,
} from "@nestjs/swagger";

import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";

import { NoticeboardService } from "./noticeboard.service";
import { CreateAnnouncementDto } from "./dtos/create.dtos";
import { QueryAnnouncementDto } from "./dtos/query.dtos";

@Controller()
@ApiTags("Notice Board")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
export class NoticeboardController {
    constructor(
        private readonly noticeboardService: NoticeboardService,
    ) { }

    @Get("notification")
    async getAll(
        @Query() queryDto: QueryAnnouncementDto,
    ) {
        return this.noticeboardService.getAnnouncements(queryDto);
    }

    @Post("announce")
    async create(
        @Body() createAnnouncementDto: CreateAnnouncementDto,
    ) {
        return this.noticeboardService.createAnnouncement(
            createAnnouncementDto,
        );
    }

    @Delete("notification")
    @ApiQuery({
        name: "id",
        type: Number,
        isArray: true,
        required: true,
    })
    async deleteMany(
        @Query("id") rawIds: string | string[],
    ) {
        const values = Array.isArray(rawIds)
            ? rawIds
            : rawIds
                ? [rawIds]
                : [];

        if (values.length === 0) {
            throw new BadRequestException(
                "Please select at least one announcement.",
            );
        }

        const ids = values.map(Number);

        if (
            ids.some(
                (id) =>
                    !Number.isSafeInteger(id) || id <= 0,
            )
        ) {
            throw new BadRequestException(
                "Invalid announcement ID.",
            );
        }

        return this.noticeboardService.deleteAnnouncements(
            [...new Set(ids)],
        );
    }
}