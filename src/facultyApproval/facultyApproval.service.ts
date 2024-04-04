import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { FindOptions, Transaction } from "sequelize";
import { parsePagesize, parseFilter, parseOrder } from "src/utils";
import { CreateFacultyApprovalDto } from "./dtos/facultyApprovalPost.dto";
import { UpdateFacultyApprovalDto } from "./dtos/facultyApprovalPatch.dto";
import { FACULTY_APPROVAL_REQUEST_DAO } from "src/constants";
import { FacultyApprovalRequestModel, FacultyModel, UserModel } from "src/db/models";
import { FacultyApprovalGetQueryDto } from "./dtos/facultyApprovalGetQuery.dto";

@Injectable()
export class FacultyApprovalService {
  constructor(@Inject(FACULTY_APPROVAL_REQUEST_DAO) private facultyApprovalRepo: typeof FacultyApprovalRequestModel) {}

  async getFacultyApprovals(where: FacultyApprovalGetQueryDto) {
    const findOptions: FindOptions<FacultyApprovalRequestModel> = {
      include: [
        {
          model: FacultyModel,
          as: "faculty",
          include: [
            {
              model: UserModel,
              as: "user",
            },
          ],
        },
      ],
    };
    // Add page size options
    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    // Apply filter
    parseFilter(findOptions, where.filterBy || {});
    // Apply order
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.facultyApprovalRepo.findAll(findOptions);

    return ans.map((obj) => obj.get({ plain: true }));
  }

  async getFacultyApproval(id: string) {
    const ans = await this.facultyApprovalRepo.findByPk(id, {
      include: [
        {
          model: FacultyModel,
          as: "faculty",
          include: [
            {
              model: UserModel,
              as: "user",
            },
          ],
        },
      ],
    });
    if (!ans) {
      throw new NotFoundException(`Faculty approval with id ${id} not found`);
    }

    return ans.get({ plain: true });
  }

  /*
   * async createFacultyApprovals(facultyApprovals: CreateFacultyApprovalDto[]): Promise<string[]> {
   *   const createdIds: string[] = [];
   *   for (const approval of facultyApprovals) {
   *     const createdApproval = await this.facultyApprovalRepo.create(approval);
   *     createdIds.push(createdApproval.id);
   *   }
   *
   *    return createdIds;
   *  }
   */

  async updateFacultyApproval(approval: UpdateFacultyApprovalDto, t: Transaction) {
    const ans = await this.facultyApprovalRepo.findByPk(approval.id);
    if (!ans) {
      throw new NotFoundException(`Faculty approval with id ${approval.id} not found`);
    }

    return await this.facultyApprovalRepo.update(approval, {
      where: { id: ans.id },
      transaction: t,
    });
  }

  async deleteFacultyApprovals(pids: string[], t: Transaction) {
    return await this.facultyApprovalRepo.destroy({
      where: { id: pids },
      transaction: t,
    });
  }
}
