/* eslint-disable no-console */
// src/upload-ppo-data.ts
import { NestFactory } from "@nestjs/core";
import { DataCliModule } from "./services/DataCliModule";
import { PPOUploadService } from "./services/PPOUploadService";

async function bootstrap() {
  console.log("🚀 PPO Data Upload Script");
  console.log("=".repeat(60));

  const appContext = await NestFactory.createApplicationContext(DataCliModule);
  const service = appContext.get(PPOUploadService);

  const [, , filePath, seasonId, year, course] = process.argv;

  if (!filePath || !seasonId) {
    console.error(`
❌ Missing required arguments!

Usage:
  npm run upload:ppo <filePath> <seasonId> [year] [course]

Arguments:
  filePath  - Path to the Excel/CSV file with PPO data
  seasonId  - UUID of the placement season
  year      - (Optional) Program year (e.g., "3" for Third Year)
  course    - (Optional) Course type (e.g., "BTECH", "MTECH", "MS")

Examples:
  npm run upload:ppo ./resources/ppo-data.xlsx abc-123-def "3" "BTECH"
  npm run upload:ppo ./data/ppo-2024.csv xyz-789-abc

Note: 
  - If year and course are not provided, students must already exist in database
  - Season ID can be found from the seasons table or /api/v1/seasons endpoint
  - Supported file formats: .xlsx, .xls, .csv
    `);
    process.exit(1);
  }

  try {
    await service.uploadPPOFromExcel(filePath, seasonId, year, course);
    console.log("\n✅ Upload complete. Check the analytics dashboard to verify.");
  } catch (err) {
    console.error("\n❌ Upload failed:", err);
    process.exit(1);
  }

  await appContext.close();
}

bootstrap();
