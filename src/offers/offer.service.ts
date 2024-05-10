import { Inject, Injectable } from "@nestjs/common";
import { OFF_CAMPUS_OFFER_DAO, ON_CAMPUS_OFFER_DAO } from "src/constants";
import {
  CompanyModel,
  JobModel,
  OffCampusOfferModel,
  OnCampusOfferModel,
  ProgramModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  UserModel,
} from "src/db/models";
import { OffCampusOffersQueryDto, OnCampusOffersQueryDto } from "./dtos/query.dto";
import { FindOptions } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateOffCampusOffersDto, CreateOnCampusOffersDto } from "./dtos/post.dto";
import { UpdateOffCampusOffersDto, UpdateOnCampusOffersDto } from "./dtos/patch.dto";

@Injectable()
export class OfferService {
  constructor(
    @Inject(ON_CAMPUS_OFFER_DAO) private onCampusOfferRepo: typeof OnCampusOfferModel,
    @Inject(OFF_CAMPUS_OFFER_DAO) private offCampusOfferRepo: typeof OffCampusOfferModel
  ) {}

  async getOnCampusOffers(where: OnCampusOffersQueryDto) {
    const findOptions: FindOptions<OnCampusOfferModel> = {
      include: [
        {
          model: SalaryModel,
          as: "salary",
          required: true,
          include: [
            {
              model: JobModel,
              as: "job",
              required: true,
              include: [
                {
                  model: SeasonModel,
                  as: "season",
                },
                {
                  model: CompanyModel,
                  as: "company",
                },
              ],
            },
          ],
        },
        {
          model: StudentModel,
          as: "student",
          required: true,
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

    const ans = await this.onCampusOfferRepo.findAll(findOptions);

    return ans.map((offer) => offer.get({ plain: true }));
  }

  async getOffCampusOffers(where: OffCampusOffersQueryDto) {
    const findOptions: FindOptions<OffCampusOfferModel> = {
      include: [
        {
          model: StudentModel,
          as: "student",
          required: true,
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
          model: CompanyModel,
          as: "company",
        },
        {
          model: SeasonModel,
          as: "season",
        },
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.offCampusOfferRepo.findAll(findOptions);

    return ans.map((offer) => offer.get({ plain: true }));
  }

  async createOnCampusOffers(offers: CreateOnCampusOffersDto[]) {
    const ans = await this.onCampusOfferRepo.bulkCreate(offers);

    return ans.map((offer) => offer.id);
  }

  async createOffCampusOffers(offers: CreateOffCampusOffersDto[]) {
    const ans = await this.offCampusOfferRepo.bulkCreate(offers);

    return ans.map((offer) => offer.id);
  }

  async updateOnCampusOffer(offer: UpdateOnCampusOffersDto) {
    const [ans] = await this.onCampusOfferRepo.update(offer, { where: { id: offer.id } });

    return ans > 0 ? [] : [offer.id];
  }

  async updateOffCampusOffer(offer: UpdateOffCampusOffersDto) {
    const [ans] = await this.offCampusOfferRepo.update(offer, { where: { id: offer.id } });

    return ans > 0 ? [] : [offer.id];
  }

  async deleteOnCampusOffers(ids: string | string[]) {
    const ans = await this.onCampusOfferRepo.destroy({ where: { id: ids } });

    return ans;
  }

  async deleteOffCampusOffers(ids: string | string[]) {
    const ans = await this.offCampusOfferRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
