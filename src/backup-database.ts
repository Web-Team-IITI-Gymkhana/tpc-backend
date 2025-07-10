/* eslint-disable no-console */
import { exec } from "child_process";
import { promisify } from "util";
import { Logger } from "@nestjs/common";
import { env } from "./config";

const execAsync = promisify(exec);

async function createBackup() {
  const logger = new Logger("DatabaseBackup");

  try {
    const config = env();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFileName = `backup-${config.DB_NAME}-${timestamp}.sql`;

    logger.log("🔄 Creating database backup...");

    // Create backup directory if it doesn't exist
    await execAsync("mkdir -p ../backups");

    // Build pg_dump command
    const pgDumpCommand = [
      "pg_dump",
      `-h ${config.DB_HOST}`,
      `-p ${config.DB_PORT}`,
      `-U ${config.DB_USERNAME}`,
      `-d ${config.DB_NAME}`,
      `--file=../backups/${backupFileName}`,
      "--verbose",
      "--clean",
      "--create",
    ].join(" ");

    // Set password environment variable
    const env_vars = { ...process.env, PGPASSWORD: config.DB_PASSWORD };

    logger.log(`📦 Backing up database to: ../backups/${backupFileName}`);

    const { stdout, stderr } = await execAsync(pgDumpCommand, { env: env_vars });

    if (stderr && !stderr.includes("NOTICE")) {
      logger.warn("Backup warnings:", stderr);
    }

    logger.log("✅ Database backup created successfully!");
    logger.log(`📁 Backup location: ../backups/${backupFileName}`);

    return `../backups/${backupFileName}`;
  } catch (error) {
    logger.error("❌ Database backup failed:", error);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);

  // Show help
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
💾 Database Backup Script

Usage: ts-node src/backup-database.ts

This script creates a complete backup of your PostgreSQL database using pg_dump.
The backup will be saved in the '../backups/' directory (outside the code directory) with a timestamp.

Requirements:
- pg_dump must be installed and available in PATH
- Database connection details must be configured in environment variables

Example:
  npm run db:backup
    `);

    return;
  }

  await createBackup();
}

// Export for use in other scripts
export { createBackup };

// Run the script if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Backup script execution failed:", error);
    process.exit(1);
  });
}
