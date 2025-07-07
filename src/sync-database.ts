/* eslint-disable no-console */
import { NestFactory } from "@nestjs/core";
import { Sequelize } from "sequelize-typescript";
import { Logger } from "@nestjs/common";
import { DatabaseModule } from "./db/database.module";

// Helper function to ensure script exits
function forceExitAfterDelay(delayMs: number = 2000) {
  setTimeout(() => {
    console.log("⚠️  Force exiting script after timeout");
    process.exit(0);
  }, delayMs);
}

interface SyncOptions {
  force?: boolean;
  alter?: boolean;
  logging?: boolean;
}

async function syncDatabase(options: SyncOptions = {}) {
  const logger = new Logger("DatabaseSync");

  try {
    // Create application context with shutdown hooks
    const appContext = await NestFactory.createApplicationContext(DatabaseModule, {
      logger: false, // Reduce noise from NestJS startup
    });
    appContext.enableShutdownHooks();
    const sequelize = appContext.get<Sequelize>("SEQUELIZE");

    logger.log("🔄 Starting database synchronization...");

    // Configure sync options
    const syncOptions: any = {
      logging: options.logging ? (msg: string) => logger.debug(msg) : false,
    };

    if (options.force) {
      syncOptions.force = true;
      logger.warn("⚠️  Force sync enabled - This will DROP and recreate all tables!");
    }

    if (options.alter) {
      syncOptions.alter = true;
      logger.log("🔧 Alter sync enabled - This will modify existing tables to match models");
    }

    // Perform database sync
    await sequelize.sync(syncOptions);

    if (options.force) {
      logger.log("🗑️  All tables dropped and recreated successfully");
    } else if (options.alter) {
      logger.log("✅ Database schema updated successfully");
    } else {
      logger.log("✅ Database synchronized successfully");
    }

    // Test connection
    await sequelize.authenticate();
    logger.log("🔗 Database connection verified");

    // Close application context
    forceExitAfterDelay(3000); // Safety net
    await appContext.close();
    process.exit(0);
  } catch (error) {
    logger.error("❌ Database synchronization failed:", error);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const options: SyncOptions = {};

  // Parse command line arguments
  if (args.includes("--force")) {
    options.force = true;
  }

  if (args.includes("--alter")) {
    options.alter = true;
  }

  if (args.includes("--verbose") || args.includes("-v")) {
    options.logging = true;
  }

  // Show help
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
🗃️  Database Synchronization Script

Usage: ts-node src/sync-database.ts [options]

Options:
  --force     Drop and recreate all tables (⚠️  DESTRUCTIVE)
  --alter     Modify existing tables to match models
  --verbose   Enable detailed logging
  --help      Show this help message

Examples:
  ts-node src/sync-database.ts                    # Safe sync (create tables if not exist)
  ts-node src/sync-database.ts --alter            # Update existing schema
  ts-node src/sync-database.ts --force --verbose  # Full recreation with logs

Note: Always backup your database before running with --force option!
    `);

    return;
  }

  // Confirm destructive operations
  if (options.force) {
    console.log("⚠️  WARNING: You are about to DROP and RECREATE all database tables!");
    console.log("📦 This will delete ALL existing data!");
    console.log("💡 Press Ctrl+C to cancel, or wait 5 seconds to continue...");

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  await syncDatabase(options);
}

// Run the script
main().catch((error) => {
  console.error("❌ Script execution failed:", error);
  process.exit(1);
});
