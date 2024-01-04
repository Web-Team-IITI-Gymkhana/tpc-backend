import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transaction, WhereOptions } from "sequelize";
import { ON_CAMPUS_OFFER_DAO } from "src/constants"; 
import { OnCampusOfferModel } from "src/db/models"; 
import { OnCampusOffer } from "src/entities/OnCampusOffer";
import { getQueryValues } from "src/utils/utils";

@Injectable()
class OnCampusOfferService {
  private logger = new Logger(OnCampusOfferService.name);

  constructor(@Inject(ON_CAMPUS_OFFER_DAO) private onCampusOfferRepo: typeof OnCampusOfferModel) {}

  async createOrGetOnCampusOffer(onCampusOffer: OnCampusOffer, t?: Transaction) {
    const values = getQueryValues(onCampusOffer);
    const [onCampusOfferModel] = await this.onCampusOfferRepo.findOrCreate({
      where: values,
      defaults: values,
      transaction: t,
    });
    return OnCampusOffer.fromModel(onCampusOfferModel);
  }

  async getOnCampusOffers(where: WhereOptions<OnCampusOfferModel>, t?: Transaction) {
    const values = getQueryValues(where);
    const onCampusOfferModels = await this.onCampusOfferRepo.findAll({
      where: values,
      transaction: t
    });
    return onCampusOfferModels.map((onCampusOfferModel) => OnCampusOffer.fromModel(onCampusOfferModel));
  }

  async updateOnCampusOffer(onCampusOfferId: string, fieldsToUpdate: object, t?: Transaction) {
    const [_, updatedModel] = await this.onCampusOfferRepo.update(fieldsToUpdate, {
      where: { id: onCampusOfferId },
      returning: true,
      transaction: t,
    });
    return OnCampusOffer.fromModel(updatedModel[0]);
  }

  async deleteOnCampusOffer(onCampusOfferId: string, t?: Transaction) {
    return !!(await this.onCampusOfferRepo.destroy({ where: { id: onCampusOfferId }, transaction: t }));
  }
}

export default OnCampusOfferService;
