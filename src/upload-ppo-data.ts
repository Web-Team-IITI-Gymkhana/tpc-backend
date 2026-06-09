/* eslint-disable no-console */
import { getModelToken } from "@nestjs/sequelize";
import { NestFactory } from "@nestjs/core";
import { DataCliModule } from "./services/DataCliModule";
import { PPOSyncService } from "./services/PPOSyncService";
import { SeasonModel } from "./db/models";

function printUsage(): void {
  console.error(`
Usage:
  npx ts-node src/upload-ppo-data.ts seasons
  npx ts-node src/upload-ppo-data.ts <intern_season_id> <placement_season_id> <program_year> <path_to_csv>

Commands:
  seasons             - Lists all season years, ids, types, and statuses for choosing PPO upload args

Arguments:
  intern_season_id    - UUID of the internship season
  placement_season_id - UUID of the placement season
  program_year        - Program year to use for matching students
  path_to_csv         - Path to the CSV file

Examples:
  npx ts-node src/upload-ppo-data.ts seasons
  npx ts-node src/upload-ppo-data.ts abc-111 xyz-222 2025 ./resources/ppo-data.csv
    `);
}

function printTable(rows: Record<string, string>[]): void {
  if (rows.length === 0) {
    console.log("No seasons found.");
    return;
  }

  const columns = ["year", "type", "status", "id"];
  const widths = columns.map((column) =>
    Math.max(column.length, ...rows.map((row) => String(row[column] ?? "").length))
  );

  const formatRow = (row: Record<string, string>) =>
    columns.map((column, index) => String(row[column] ?? "").padEnd(widths[index])).join("  ");

  console.log(formatRow({ year: "year", type: "type", status: "status", id: "id" }));
  console.log(widths.map((width) => "-".repeat(width)).join("  "));
  rows.forEach((row) => console.log(formatRow(row)));
}

async function printSeasons(): Promise<void> {
  const appContext = await NestFactory.createApplicationContext(DataCliModule, {
    logger: ["error", "warn"],
  });

  try {
    const seasonRepo = appContext.get<typeof SeasonModel>(getModelToken(SeasonModel));
    const seasons = await seasonRepo.findAll({
      attributes: ["id", "year", "type", "status"],
      order: [
        ["year", "ASC"],
        ["type", "ASC"],
      ],
    });

    const rows = seasons.map((season) => {
      const { id, year, type, status } = season.get({ plain: true }) as SeasonModel;

      return { year, type, status, id };
    });

    console.log("Available seasons:");
    printTable(rows);
  } finally {
    await appContext.close();
  }
}

async function bootstrap(): Promise<void> {
  const [, , commandOrInternSeasonId, placementSeasonId, programYear, filePath] = process.argv;

  if (commandOrInternSeasonId === "seasons" || commandOrInternSeasonId === "list-seasons") {
    await printSeasons();
    return;
  }

  if (!commandOrInternSeasonId || !placementSeasonId || !programYear || !filePath) {
    printUsage();
    process.exit(1);
  }

  const appContext = await NestFactory.createApplicationContext(DataCliModule, {
    logger: ["error", "warn"],
  });

  try {
    const service = appContext.get(PPOSyncService);
    await service.syncPPOData(commandOrInternSeasonId, placementSeasonId, programYear, filePath);
  } catch (err) {
    console.error("Fatal error:", err);
    process.exit(1);
  } finally {
    await appContext.close();
  }
}

bootstrap();
