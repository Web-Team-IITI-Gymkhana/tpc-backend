import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { EXTERNAL_OPPORTUNITIES_DAO } from "src/constants";
import { ExternalOpportunitiesModel } from "src/db/models";
import { PostExternalOpportunitiesDto } from "./dtos/post.dto";
import sequalize, { FindOptions, Transaction, Op } from "sequelize";
import { ExternalOpportunitiesQueryDto } from "./dtos/query.dto";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";

@Injectable()
export class ExternalOpportunitiesService {
  constructor(
    @Inject(EXTERNAL_OPPORTUNITIES_DAO) private externalOpportunitiesRepo: typeof ExternalOpportunitiesModel
  ) {}

  async getExternalOpportunities(where: ExternalOpportunitiesQueryDto) {
    const findOptions: FindOptions<ExternalOpportunitiesModel> = {};
    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.externalOpportunitiesRepo.findAll(findOptions);

    return ans.map((externalOpportunity) => externalOpportunity.get({ plain: true }));
  }

  async createExternalOpportunities(externalOpportunities: PostExternalOpportunitiesDto[]) {
    const ans = await this.externalOpportunitiesRepo.bulkCreate(externalOpportunities, {
      updateOnDuplicate: ["company", "lastdate", "link"],
    });

    return ans.map((externalOpportunity) => externalOpportunity.id);
  }

  async deleteExternalOpportunities(ids: string[]) {
    const ans = await this.externalOpportunitiesRepo.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    return ans;
  }
}
