import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UpdateTpcMemberViewDto } from "./dto/update-tpc-member-view.dto";
import { TPC_MEMBER_DAO } from "src/constants";
import { TpcMemberModel, UserModel } from "src/db/models";

@Injectable()
export class TpcMemberViewService {
  constructor(@Inject(TPC_MEMBER_DAO) private tpcMemberRepo: typeof TpcMemberModel) {}

  async getTpcMember(id: string) {
    const ans = await this.tpcMemberRepo.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
    });

    if (!ans) throw new NotFoundException(`The Tpc Member with id ${id} does not exist`);

    return ans.get({ plain: true });
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
