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
export class OfferService {
  constructor(
    @Inject(OFF_CAMPUS_OFFER_DAO) private offCampusOfferRepo: typeof OffCampusOfferModel,
    @Inject(ON_CAMPUS_OFFER_DAO) private onCampusOfferRepo: typeof OnCampusOfferModel
  ) {}

  async getOffCampusOffers(studentId: string) {
    const ans = await this.offCampusOfferRepo.findAll({
      where: { studentId },
      include: [
        {
          model: CompanyModel,
          as: "company",
        },
        {
          model: SeasonModel,
          as: "season",
        },
      ],
    });

    return ans.map((offer) => offer.get({ plain: true }));
  }

  async getOnCampusOffers(studentId: string) {
    const ans = await this.onCampusOfferRepo.findAll({
      where: { studentId },
      include: [
        {
          model: SalaryModel,
          as: "salary",
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
              ],
            },
          ],
        },
      ],
    });

    return ans.map((offer) => offer.get({ plain: true }));
  }
}
