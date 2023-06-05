import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { companiesContactDto } from './companiesContact.dto';
import { ConfigService } from '@nestjs/config';
import { contactModel } from 'src/db/models/contact';

@Injectable()
export class companiesContactsService {
  configService: any;

  constructor(private config: ConfigService) {}

  async create(Company_id: typeof randomUUID, companyContact: companiesContactDto): Promise<any> {
    let flag = false;
    const { email, name, Primary_number, Secondary_number, Role } = companyContact;
    const contact = { primary: Primary_number, secondary: Secondary_number };
    let values;
    await contactModel
      .create({
        email,
        Name: name,
        contact,
        Company_id,
        Role,
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

  async get(Company_id: typeof randomUUID): Promise<any> {
    const contact = await contactModel.findAll({
      where: { Company_id: Company_id },
    });
    if (contact.length == 0) {
      return { message: 'no contacts found', status: 404 };
    }
    return { data: contact, status: 200 };
  }

  async update(
    Company_id: typeof randomUUID,
    Contact_id: typeof randomUUID,
    companyContact: companiesContactDto,
  ): Promise<any> {
    const { email, name, Primary_number, Secondary_number, Role } = companyContact;
    const contact = { primary: Primary_number, secondary: Secondary_number };

    const [rowsUpdated, [updatedEntity]] = await contactModel
      .update(
        {
          email,
          Name: name,
          contact,
          Role,
        },
        {
          where: {
            Contact_id: Contact_id,
            Company_id: Company_id,
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

  async delete(Company_id: typeof randomUUID, Contact_id: typeof randomUUID): Promise<any> {
    let flag = false,
      rows;
    await contactModel
      .destroy({
        where: {
          Contact_id,
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
