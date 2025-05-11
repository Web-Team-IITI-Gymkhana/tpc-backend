/* eslint-disable no-console */
import { NestFactory } from "@nestjs/core";
import { DataModule } from "./services/DataModule"; // Adjust path as needed
import { DataUploadService } from "./services/DataService"; // Adjust path as needed

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(DataModule);
  const dataUploadService = app.get(DataUploadService);

  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Please provide a path to the Excel file.");
    process.exit(1);
  }

  try {
    await dataUploadService.uploadFromExcel(filePath, "2025", "BTech", "d4b2e14e-5dec-45b2-aec9-3bcdcb3b00d5");
  } catch (err) {
    console.error("Error uploading data:", err.message);
  } finally {
    await app.close();
  }
}
bootstrap();
