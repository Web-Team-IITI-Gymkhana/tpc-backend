import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Recruiter } from "../../db/models/recruiter";
import { recruiterDto } from "./recruiter.dto";
import { Member } from "src/db/models/member";
import { Role } from "src/db/enums/role.enum";
import { Sequelize } from "sequelize-typescript";
import { recruiterSearchDto } from "./recruiterSearch.dto";
import { Company } from "src/db/models/company";
import { recruiterUpdateDto } from "./recruiterUpdate.dto";

@Injectable()
export class recruiterService {
  constructor(
    private config: ConfigService,
    private sequelize: Sequelize
  ) {}

  createRecruiter = async (recruiter: recruiterDto) => {
    const t = await this.sequelize.transaction();

    try {
      // let recruiterEntry: any= {}
      const { name, contact, email, companyName } = recruiter;
      console.log(name, contact, email, companyName);
      console.log(t);

      //finding company name
      const pr1 = Company.findOrCreate({
        where: { name: companyName },
        defaults: { name: companyName },
        transaction: t,
      });

      // inserting recruiters in the member
      const pr2 = Member.findOrCreate({
        where: { email },
        defaults: { name, email, contact, role: Role.RECRUITER },
        transaction: t,
      });

      const [[current_company_found, created_company], [statusFound, created]] = await Promise.all([pr1, pr2]);

      if (!created) {
        // updating both member and recruiter bcoz they already exists
        const pr3 = await Member.update(
          { name, role: Role.RECRUITER, email, contact },
          {
            where: { email },
            returning: true,
            transaction: t,
          }
        );

        // recruiterEntry,
        const pr4 = await Recruiter.update(
          {
            memberId: statusFound.dataValues.id,
            companyId: current_company_found.dataValues.id,
          },

          {
            where: { memberId: statusFound.id },
            returning: true,
            transaction: t,
          }
        );
        const [[rowsUpdated, [updatedEntity]], [rowsUpdated1, [newrecruiter]]] = await Promise.all([pr3, pr4]);
        await t.commit();
        return { data: newrecruiter, status: 200 };
      } else {
        // creating new recruiter
        const newrecruiter = await Recruiter.create(
          {
            memberId: statusFound.id,
            companyId: current_company_found.dataValues.id,
          },
          { transaction: t }
        );
        await t.commit();
        return { data: newrecruiter, status: 200 };
      }
    } catch (err) {
      await t.rollback();
      console.log(err);
      return { status: 400, error: err };
    }
  };

  queryBuilder = (params: any) => {
    let companyQuery: any = {},
      memberQuery: any = {};
    if (params.name) {
      memberQuery.name = params.name;
    }
    if (params.email) {
      memberQuery.email = params.email;
    }
    if (params.contact) {
      memberQuery.contact = params.contact;
    }
    if (params.companyName) {
      companyQuery.name = params.companyName;
    }
    return { companyQuery, memberQuery };
  };

  async get(searchParams: recruiterSearchDto): Promise<any> {
    try {
      const { companyQuery, memberQuery } = this.queryBuilder(searchParams);
      const result = await Recruiter.findAll({
        include: [
          {
            model: Member,
            where: memberQuery,
            required: true,
          },
          {
            model: Company,
            where: companyQuery,
            required: true,
          },
        ],
      });
      return { status: 200, data: result };
    } catch (error) {
      console.log(error);
      return { status: 400, error: error };
    }
  }

  async updateRecruiter(recruiter: recruiterUpdateDto) {
    const t = await this.sequelize.transaction();
    try {
      const memberId = recruiter.memberId;
      const { companyQuery, memberQuery } = this.queryBuilder(recruiter);

      const memupd = Member.update(memberQuery, {
        where: { id: memberId },
        transaction: t,
      });

      if (companyQuery.name) {
        const [created_company_found, created_company] = await Company.findOrCreate({
          where: { name: companyQuery.name },
          transaction: t,
        });
        const res = await Recruiter.update(
          { companyId: created_company_found.dataValues.id },
          {
            where: { memberId: memberId },
            transaction: t,
          }
        );
      }

      const res = await memupd;
      await t.commit();
      return { status: 200, output: res };
    } catch (err) {
      console.log(err);
      await t.rollback();
      return { status: 400, error: err };
    }
  }

  async delete(recruiters: any) {
    try {
      const res1 = await Member.destroy({
        where: {
          id: recruiters,
        },
      });
      return { status: 200, output: res1 };
    } catch (err) {
      return { status: 400, error: err };
    }
  }
}
