import { Module } from "@nestjs/common";
import { TpcMemberController } from "./tpcMember.controller";
import { TpcMemberService } from "./tpcMember.service";

@Module({
  controllers: [TpcMemberController],
  providers: [TpcMemberService],
})
export class TpcMemberModule {}
