/* eslint-disable no-console */
import { NestFactory } from "@nestjs/core";
import { DataCliModule } from "./services/DataCliModule";
import { PPOSyncService } from "./services/PPOSyncService";

async function bootstrap(): Promise<void> {
  const [, , internSeasonId, placementSeasonId, programYear, filePath] = process.argv;

  if (!internSeasonId || !placementSeasonId || !programYear || !filePath) {
    console.error(`
Usage:
  npx ts-node src/upload-ppo-data.ts <intern_season_id> <placement_season_id> <program_year> <path_to_csv>

Arguments:
  intern_season_id    - UUID of the internship season
  placement_season_id - UUID of the placement season
  program_year        - Program year to use for matching students
  path_to_csv         - Path to the CSV file

Example:
  npx ts-node src/upload-ppo-data.ts abc-111 xyz-222 2025 ./resources/ppo-data.csv
    `);
    process.exit(1);
  }

  const appContext = await NestFactory.createApplicationContext(DataCliModule, {
    logger: ["error", "warn"],
  });

  try {
    const service = appContext.get(PPOSyncService);
    await service.syncPPOData(internSeasonId, placementSeasonId, programYear, filePath);
  } catch (err) {
    console.error("Fatal error:", err);
    process.exit(1);
  } finally {
    await appContext.close();
  }
}

bootstrap();
