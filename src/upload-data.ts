/* eslint-disable no-console */
// src/main.upload.ts
import { NestFactory } from "@nestjs/core";
import { DataCliModule } from "./services/DataCliModule";
import { DataUploadService } from "./services/DataService";

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(DataCliModule);
  const service = appContext.get(DataUploadService);

  const [, , filePath, year, course, seasonId] = process.argv;

  if (!filePath || !year || !course || !seasonId) {
    console.error("❌ Missing arguments: filePath, year, course, seasonId are required");
    process.exit(1);
  }

  try {
    await service.uploadFromExcel(filePath, year, course, seasonId);
    console.log("✅ Upload complete.");
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }

  await appContext.close();
}
bootstrap();
