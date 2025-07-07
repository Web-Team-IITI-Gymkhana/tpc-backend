/* eslint-disable no-console */
import { NestFactory } from "@nestjs/core";
import { Sequelize } from "sequelize-typescript";
import { Logger } from "@nestjs/common";
import { DatabaseModule } from "./db/database.module";
import { createBackup } from "./backup-database";

// Helper function to ensure script exits
function forceExitAfterDelay(delayMs: number = 2000) {
  setTimeout(() => {
    console.log("⚠️  Force exiting script after timeout");
    process.exit(0);
  }, delayMs);
}

interface MigrationOptions {
  backup?: boolean;
  dryRun?: boolean;
  force?: boolean;
  alter?: boolean;
  verbose?: boolean;
}

async function runMigration(options: MigrationOptions = {}) {
  const logger = new Logger("DatabaseMigration");

  try {
    // Create backup if requested
    if (options.backup) {
      logger.log("📦 Creating backup before migration...");
      await createBackup();
      logger.log("✅ Backup completed successfully");
    }

    // Create application context with shutdown hooks
    const appContext = await NestFactory.createApplicationContext(DatabaseModule, {
      logger: false, // Reduce noise from NestJS startup
    });
    appContext.enableShutdownHooks();
    const sequelize = appContext.get<Sequelize>("SEQUELIZE");

    logger.log("🔄 Starting database migration...");

    // Test connection first
    await sequelize.authenticate();
    logger.log("🔗 Database connection verified");

    if (options.dryRun) {
      logger.log("🧪 DRY RUN MODE - No changes will be made to the database");

      // Get current database structure
      const queryInterface = sequelize.getQueryInterface();
      const tables = await queryInterface.showAllTables();

      logger.log(`📊 Current database has ${tables.length} tables:`);
      tables.forEach((table) => logger.log(`  - ${table}`));

      // Show what would be done
      logger.log("🔍 Models that would be synchronized:");
      Object.values(sequelize.models).forEach((model) => {
        logger.log(`  - ${model.tableName} (${model.name})`);
      });

      logger.log("✅ Dry run completed - no changes made");
      forceExitAfterDelay(3000); // Safety net
      await appContext.close();
      process.exit(0);
    }

    // Configure sync options
    const syncOptions: any = {
      logging: options.verbose ? (msg: string) => logger.debug(msg) : false,
    };

    if (options.force) {
      syncOptions.force = true;
      logger.warn("⚠️  Force migration enabled - This will DROP and recreate all tables!");
    }

    if (options.alter) {
      syncOptions.alter = true;
      logger.log("🔧 Alter migration enabled - This will modify existing tables to match models");
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

    // Verify migration
    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();
    logger.log(`📊 Migration completed - Database now has ${tables.length} tables`);

    // Close application context
    forceExitAfterDelay(3000); // Safety net
    await appContext.close();
    process.exit(0);
  } catch (error) {
    logger.error("❌ Database migration failed:", error);

    if (options.backup) {
      logger.log("💡 A backup was created before this migration attempt");
      logger.log("💡 You can restore from the backup if needed");
    }

    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const options: MigrationOptions = {};

  // Parse command line arguments
  if (args.includes("--backup")) {
    options.backup = true;
  }

  if (args.includes("--dry-run")) {
    options.dryRun = true;
  }

  if (args.includes("--force")) {
    options.force = true;
  }

  if (args.includes("--alter")) {
    options.alter = true;
  }

  if (args.includes("--verbose") || args.includes("-v")) {
    options.verbose = true;
  }

  // Show help
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
🗃️  Database Migration Script

Usage: ts-node src/migrate-database.ts [options]

Options:
  --backup    Create a backup before migration
  --dry-run   Show what would be done without making changes
  --force     Drop and recreate all tables (⚠️  DESTRUCTIVE)
  --alter     Modify existing tables to match models
  --verbose   Enable detailed logging
  --help      Show this help message

Examples:
  ts-node src/migrate-database.ts --dry-run           # Preview changes
  ts-node src/migrate-database.ts --backup            # Safe migration with backup
  ts-node src/migrate-database.ts --alter --backup    # Update schema with backup
  ts-node src/migrate-database.ts --force --backup    # Full recreation with backup

Recommended workflow:
  1. Run with --dry-run to preview changes
  2. Run with --backup for safe migration
  3. Use --alter for schema updates
  4. Only use --force when starting fresh

Note: Always backup your database before destructive operations!
    `);

    return;
  }

  // Confirm destructive operations
  if (options.force && !options.dryRun) {
    console.log("⚠️  WARNING: You are about to DROP and RECREATE all database tables!");
    console.log("📦 This will delete ALL existing data!");

    if (!options.backup) {
      console.log("💡 Consider running with --backup flag for safety");
    }

    console.log("💡 Press Ctrl+C to cancel, or wait 5 seconds to continue...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  await runMigration(options);
}

// Run the script
main().catch((error) => {
  console.error("❌ Migration script execution failed:", error);
  process.exit(1);
});
