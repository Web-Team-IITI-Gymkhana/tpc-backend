import { Module } from "@nestjs/common";
import { TpcMemberViewService } from "./tpc-member-view.service";
import { TpcMemberViewController } from "./tpc-member-view.controller";

@Module({
  controllers: [TpcMemberViewController],
  providers: [TpcMemberViewService],
})
export class TpcMemberViewModule {}
