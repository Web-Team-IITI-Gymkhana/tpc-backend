import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { memberSearchDto } from "./memberSearch.dto";
import { Member } from "src/db/models/member";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class memberSearchService {
  constructor(
    private config: ConfigService,
    private sequelize: Sequelize
  ) {}

  async get(searchParams: memberSearchDto): Promise<any> {
    try {
      const result = await Member.findAll({
        where: { ...searchParams },
      });
      return { status: 200, data: result };
    } catch (error) {
      console.log(error);
      return { status: 400, error: error };
    }
  }
}
