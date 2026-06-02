import { Module } from "@nestjs/common";
import { NoticeboardController } from "./noticeboard.controller";
import { NoticeboardService } from "./noticeboard.service";
import { noticeboardProviders } from "./noticeboard.providers";

@Module({
    controllers: [NoticeboardController],
    providers: [...noticeboardProviders, NoticeboardService],
    exports: [NoticeboardService],
})
export class NoticeboardModule { }