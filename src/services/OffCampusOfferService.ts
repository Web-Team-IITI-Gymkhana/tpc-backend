import { Inject, Injectable, Logger } from "@nestjs/common";
import { omit } from "lodash";
import { Transaction, WhereOptions } from "sequelize";
import { OFF_CAMPUS_OFFER_DAO } from "src/constants";
import { OffCampusOfferModel, TpcMemberModel, UserModel } from "src/db/models";
import { OffCampusOffer } from "src/entities/OffCampusOffer";
import { getQueryValues } from "src/utils/utils";

@Injectable()
class OffCampusOfferService {
  private logger = new Logger(OffCampusOfferService.name);

  constructor(@Inject(OFF_CAMPUS_OFFER_DAO) private offCampusOfferRepo: typeof OffCampusOfferModel) {}

  async createOrGetOffCampusOffer(offCampusOffer: OffCampusOffer, t?: Transaction) {
    const values = getQueryValues(offCampusOffer);
    const [offCampusOfferModel] = await this.offCampusOfferRepo.findOrCreate({
      where: values,
      defaults: values,
      transaction: t,
    });
    return OffCampusOffer.fromModel(offCampusOfferModel);
  }

  async getOffCampusOffers(where: WhereOptions<OffCampusOfferModel>, t?: Transaction) {
    const values = getQueryValues(where);
    const offCampusOfferModels = await this.offCampusOfferRepo.findAll({
      where: values,
      transaction: t
    });
    return offCampusOfferModels.map((offCampusOfferModel) => OffCampusOffer.fromModel(offCampusOfferModel));
  }

  async updateOffCampusOffer(offCampusOfferId: string, fieldsToUpdate: object, t?: Transaction) {
    const [_, updatedModel] = await this.offCampusOfferRepo.update(fieldsToUpdate, {
      where: { id: offCampusOfferId },
      returning: true,
      transaction: t,
    });
    return OffCampusOffer.fromModel(updatedModel[0]);
  }

  async deleteOffCampusOffer(offCampusOfferId: string, t?: Transaction) {
    return !!(await this.offCampusOfferRepo.destroy({ where: { id: offCampusOfferId }, transaction: t }));
  }
}

export default OffCampusOfferService;
