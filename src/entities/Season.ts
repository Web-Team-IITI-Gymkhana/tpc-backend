import { SeasonModel } from "src/db/models";
import { SeasonType } from "src/db/enums";

export class Season {
  id?: string;
  type: SeasonType;
  year: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: { id?: string; type: SeasonType; year: string; createdAt?: Date; updatedAt?: Date }) {
    Object.assign(this, input);
  }

  static fromModel(season: SeasonModel): Season {
    return new this({
      id: season.id,
      year: season.year,
      type: season.type as SeasonType,
      createdAt: season.createdAt,
      updatedAt: season.updatedAt,
    });
  }
}
