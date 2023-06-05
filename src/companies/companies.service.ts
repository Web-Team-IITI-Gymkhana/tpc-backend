import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { companiesDto } from './companies.dto';
import { ConfigService } from '@nestjs/config';
import { companyModel } from 'src/db/models/company';

@Injectable()
export class companiesService {
  configService: any;

  constructor(private config: ConfigService) {}

  async create(company: companiesDto): Promise<any> {
    let flag = false;
    const { name, imageLink } = company;

    let values;
    await companyModel
      .create({
        name,
        imageLink,
      })
      .then(async (data) => {
        flag = true;
        values = data.dataValues;
      })
      .catch((error) => {
        if (error.name === 'SequelizeUniqueConstraintError') {
          throw new ForbiddenException('Credentials incorrect');
        }
        throw error;
      });
    if (flag) {
      return { status: 200, data: values };
    } else {
      return { status: 400, data: null };
    }
  }

  async get(): Promise<any> {
    const companies = await companyModel.findAll();
    if (companies.length == 0) {
      return { message: 'no companies found', status: 404 };
    }
    return { data: companies, status: 200 };
  }

  async update(Company_id: typeof randomUUID, company: companiesDto): Promise<any> {
    const [rowsUpdated, [updatedEntity]] = await companyModel
      .update(company, {
        where: {
          Company_id: Company_id,
        },
        returning: true,
      })
      .catch((err) => {
        throw err;
      });

    if (rowsUpdated === 0) {
      return { message: 'Not Found', status: 400 };
    }
    return { data: updatedEntity, status: 200 };
  }

  async delete(Company_id: typeof randomUUID): Promise<any> {
    let flag = false,
      rows;
    await companyModel
      .destroy({
        where: {
          Company_id,
        },
      })
      .then((del_rows) => {
        flag = true;
        rows = del_rows;
      })
      .catch((err) => {
        if (err.name === 'SequelizeUniqueConstraintError') {
          throw new ForbiddenException('Credentials incorrect');
        }
        console.log(err);
        return err;
      });
    if (flag) {
      return { status: 200, data: rows };
    } else {
      return { status: 400, message: 'invalid' };
    }
  }
}
