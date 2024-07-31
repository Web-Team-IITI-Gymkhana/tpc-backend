import { Injectable } from "@nestjs/common";
import { CreateTpcMemberViewDto } from "./dto/create-tpc-member-view.dto";
import { UpdateTpcMemberViewDto } from "./dto/update-tpc-member-view.dto";

@Injectable()
export class TpcMemberViewService {
  create(createTpcMemberViewDto: CreateTpcMemberViewDto) {
    return "This action adds a new tpcMemberView";
  }

  findAll() {
    return `This action returns all tpcMemberView`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tpcMemberView`;
  }

  update(id: number, updateTpcMemberViewDto: UpdateTpcMemberViewDto) {
    return `This action updates a #${id} tpcMemberView`;
  }

  remove(id: number) {
    return `This action removes a #${id} tpcMemberView`;
  }
}
