import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { teamDto } from './team.dto';
import { ConfigService } from '@nestjs/config';
import { authModel } from 'src/db/models/auth';
import { contactModel } from 'src/db/models/contact';
import { companyModel } from 'src/db/models/company';

import { sequelizeInstance } from 'src/db/database.providers';

@Injectable()
export class teamService {
  configService: any;

  constructor(private config: ConfigService) {}

  async create(member: teamDto): Promise<any> {
    const name = 'TPC';
    const { email, role } = member;
    let transaction;
    try {
      transaction = await sequelizeInstance.transaction();
      const company = await companyModel.findAll({ where: { name } });
      const contactValues = await contactModel.create({ email, role, companyId: company[0].id });
      const authValues = await authModel.create({ email, role: 'MEMBER' });
      await transaction.commit();
      return { data: contactValues, status: 200 };
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      return { data: null, status: 400 };
    }
  }

  async get(): Promise<any> {
    const name = 'TPC';
    try {
      const company = await companyModel.findAll({ where: { name } });
      const values = await contactModel.findAll({ where: { companyId: company[0].id } });
      return { data: values, status: 200 };
    } catch (error) {
      return { data: null, status: 400 };
    }
  }

  async update(id: typeof randomUUID, company: teamDto): Promise<any> {
    let transaction;
    try {
      transaction = await sequelizeInstance.transaction();
      const contact = await contactModel.findAll({ where: { id } });
      const newContact = await contactModel.update(company, {
        where: { id },
        returning: true,
      });
      const newAuth = await authModel.update(
        { email: company.email, role: 'MEMBER' },
        {
          where: { email: contact[0].email },
          returning: true,
        },
      );
      await transaction.commit();
      return { data: newContact, status: 200 };
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      return { data: null, status: 400 };
    }
  }

  async delete(id: typeof randomUUID): Promise<any> {
    let transaction;
    try {
      transaction = await sequelizeInstance.transaction();
      const contact = await contactModel.findAll({ where: { id } });
      const delContact = await contactModel.destroy({
        where: { id },
      });
      const delAuth = await authModel.destroy({
        where: { email: contact[0].email },
      });
      return { data: delContact, status: 200 };
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      return { data: null, status: 400 };
    }
  }
}
