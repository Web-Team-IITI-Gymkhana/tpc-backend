import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { seasonModel } from 'src/db/models/season';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class seasonsService {
  configService: any;

  constructor(private config: ConfigService) {}

  async create(name: string): Promise<any> {
    let flag = false;
    let values;
    await seasonModel
      .create({
        name,
      })
      .then(async (data) => {
        flag = true;
        values = data.dataValues.id;
      })
      .catch((error) => {
        if (error.name === 'SequelizeUniqueConstraintError') {
          throw new ForbiddenException('Credentials incorrect');
        }
        throw error;
      });
    if (flag) {
      return { status: 200, uuid: values };
    } else {
      return { status: 400, uuid: null };
    }
  }

  async get(): Promise<any> {
    const seasons = await seasonModel.findAll();
    if (seasons.length == 0) {
      return { message: 'no user found', status: 404 };
    }
    return seasons;
  }

  async delete(id: typeof randomUUID): Promise<any> {
    let flag = false;
    await seasonModel
      .destroy({
        where: {
          id,
        },
      })
      .then((del_rows) => {
        flag = true;
        console.log(del_rows);
      })
      .catch((err) => {
        if (err.name === 'SequelizeUniqueConstraintError') {
          throw new ForbiddenException('Credentials incorrect');
        }
        console.log(err);
        return err;
      });
    if (flag) {
      return { status: 200, message: true };
    } else {
      return { status: 400, message: false };
    }
  }
}
