import { NOTICEBOARD_DAO } from "src/constants";
import { NoticeboardModel } from "src/db/models";

export const noticeboardProviders = [
    {
        provide: NOTICEBOARD_DAO,
        useValue: NoticeboardModel,
    },
];