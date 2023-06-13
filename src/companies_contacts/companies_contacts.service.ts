import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { companiesContactDto } from './companiesContact.dto';
import { ConfigService } from '@nestjs/config';
import { contactModel } from 'src/db/models/contact';

@Injectable()
export class companiesContactsService {
  configService: any;

  constructor(private config: ConfigService) {}

  async create(companyId: typeof randomUUID, companyContact: companiesContactDto): Promise<any> {
    let flag = false;
    const { email, name, primaryNumber, secondaryNumber, role } = companyContact;
    const contact = { primary: primaryNumber, secondary: secondaryNumber };
    let values;
    await contactModel
      .create({
        email,
        name,
        contact,
        companyId,
        role,
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
      return { status: 400, message: 'Operation Terminated' };
    }
  }

  async get(companyId: typeof randomUUID): Promise<any> {
    const contact = await contactModel.findAll({
      where: { companyId },
    });
    if (contact.length == 0) {
      return { message: 'no contacts found', status: 404 };
    }
    return { data: contact, status: 200 };
  }

  async update(id: typeof randomUUID, companyContact: companiesContactDto): Promise<any> {
    const { email, name, primaryNumber, secondaryNumber, role } = companyContact;
    const contact = { primary: primaryNumber, secondary: secondaryNumber };

    const [rowsUpdated, [updatedEntity]] = await contactModel
      .update(
        {
          email,
          name,
          contact,
          role,
        },
        {
          where: {
            id,
          },
          returning: true,
        },
      )
      .catch((err) => {
        throw err;
      });

    if (rowsUpdated === 0) {
      return { message: 'not found', status: 400 };
    }
    return { data: updatedEntity, status: 200 };
  }

  async delete(id: typeof randomUUID): Promise<any> {
    let flag = false,
      rows;
    await contactModel
      .destroy({
        where: {
          id,
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
      return { status: 200, message: rows };
    } else {
      return { status: 400, message: 'invalid' };
    }
  }
}
