import { Inject, Injectable } from "@nestjs/common";
import { OFF_CAMPUS_OFFER_DAO, ON_CAMPUS_OFFER_DAO } from "src/constants";
import {
  CompanyModel,
  JobModel,
  OffCampusOfferModel,
  OnCampusOfferModel,
  SalaryModel,
  SeasonModel,
} from "src/db/models";

@Injectable()
export class StudentOfferService {
  constructor(
    @Inject(OFF_CAMPUS_OFFER_DAO) private offCampusOffersRepo: typeof OffCampusOfferModel,
    @Inject(ON_CAMPUS_OFFER_DAO) private onCampusOfferRepo: typeof OnCampusOfferModel
  ) {}

  async getOnCampusOffers(id: string) {
    const ans = await this.onCampusOfferRepo.findAll({
      where: { studentId: id },
      include: [
        {
          model: SalaryModel,
          as: "salary",
          include: [
            {
              model: JobModel,
              as: "job",
              attributes: ["id", "role", "others"],
              include: [
                {
                  model: CompanyModel,
                  as: "company",
                  attributes: ["id", "name", "domains", "category"],
                },
                {
                  model: SeasonModel,
                  as: "season",
                  attributes: ["id", "year", "type"],
                },
              ],
            },
          ],
        },
      ],
    });

    return ans.map((offer) => offer.get({ plain: true }));
  }

  async getOffCampusOffer(id: string) {
    const ans = await this.offCampusOffersRepo.findAll({
      where: { studentId: id },
      include: [
        {
          model: SeasonModel,
          as: "season",
          attributes: ["id", "year", "type"],
        },
        {
          model: CompanyModel,
          as: "company",
          attributes: ["id", "name", "domains", "category"],
        },
      ],
    });

    return ans.map((offer) => offer.get({ plain: true }));
  }
}
