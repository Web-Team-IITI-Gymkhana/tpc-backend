import { Module } from "@nestjs/common";
import { TpcMemberController } from "./tpcMember.controller";

@Module({
  controllers: [TpcMemberController],
  providers: [],
})
export class TpcMemberModule {}
