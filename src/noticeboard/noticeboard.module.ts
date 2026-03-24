import { Module } from "@nestjs/common";
import { NoticeboardController } from "./noticeboard.controller";
import { NoticeboardService } from "./noticeboard.service";
import { MongooseModule } from "@nestjs/mongoose";
import { NoticeSchema } from "./noticeboard.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "Announce", schema: NoticeSchema },
        ]),
    ],
    controllers: [NoticeboardController],
    providers: [NoticeboardService],
})
export class NoticeboardModule { }