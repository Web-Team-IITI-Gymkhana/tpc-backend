import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { TPC_MEMBER_DAO } from "src/constants";
import {
  CompanyModel,
  EventModel,
  JobCoordinatorModel,
  JobModel,
  OnCampusOfferModel,
  ProgramModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  TpcMemberModel,
  UserModel,
} from "src/db/models";
import { RoleEnum } from "src/enums/role.enum"; // Import RoleEnum
import { TpcMembersQueryDto } from "./dtos/query.dto";
import { FindOptions } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateTpcMembersDto } from "./dtos/post.dto";
import { UpdateTpcMembersDto } from "./dtos/patch.dto";
import sequelize from "sequelize";

@Injectable()
export class TpcMemberService {
  constructor(@Inject(TPC_MEMBER_DAO) private tpcMemberRepo: typeof TpcMemberModel) {}

  async getTpcMembers(where: TpcMembersQueryDto) {
    const findOptions: FindOptions<TpcMemberModel> = {
      include: [
        {
          model: StudentModel,
          as: "student",
          include: [
            {
              model: UserModel,
              as: "user",
            },
            {
              model: ProgramModel,
              as: "program",
            },
          ],
        },
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.tpcMemberRepo.findAll(findOptions);

    return ans.map((tpcMember) => tpcMember.get({ plain: true }));
  }

  async getTpcMember(id: string) {
    const ans = await this.tpcMemberRepo.findByPk(id, {
      include: [
        {
          model: StudentModel,
          as: "student",
          include: [
            {
              model: UserModel,
              as: "user",
            },
            {
              model: ProgramModel,
              as: "program",
            },
          ],
        },
        {
          model: JobCoordinatorModel,
          as: "jobCoordinators",
          include: [
            {
              model: JobModel,
              as: "job",
              include: [
                {
                  model: CompanyModel,
                  as: "company",
                },
                {
                  model: SeasonModel,
                  as: "season",
                },
                {
                  model: SalaryModel,
                  as: "salaries",
                },
                {
                  model: EventModel,
                  as: "events",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!ans) throw new NotFoundException(`The CAMC Member with id ${id} does not exist`);

    return ans.get({ plain: true });
  }

  async createTpcMembers(tpcMembers: CreateTpcMembersDto[]) {
    const ans = await this.tpcMemberRepo.bulkCreate(tpcMembers);

    // Update the user role to TPC_MEMBER for the created CAMC members
    const studentIds = ans.map((tpcMember) => tpcMember.studentId);
    const userIds = await StudentModel.findAll({
      where: {
        id: studentIds,
      },
      attributes: ["userId"],
    }).then((students) => students.map((student) => student.userId));
    await UserModel.update(
      { role: RoleEnum.TPC_MEMBER },
      {
        where: {
          id: userIds,
        },
      }
    );

    return ans.map((tpcMember) => tpcMember.id);
  }

  async updateTpcMember(tpcMember: UpdateTpcMembersDto) {
    const [ans] = await this.tpcMemberRepo.update(tpcMember, { where: { id: tpcMember.id } });

    return ans > 0 ? [] : [tpcMember.id];
  }

  async deleteTpcMembers(ids: string | string[]) {
    const ans = await this.tpcMemberRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
