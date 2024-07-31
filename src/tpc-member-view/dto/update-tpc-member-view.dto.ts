import { PartialType } from "@nestjs/swagger";
import { CreateTpcMemberViewDto } from "./create-tpc-member-view.dto";

export class UpdateTpcMemberViewDto extends PartialType(CreateTpcMemberViewDto) {}
