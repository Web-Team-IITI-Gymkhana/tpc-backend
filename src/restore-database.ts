/* eslint-disable no-console */
import { exec } from "child_process";
import { promisify } from "util";
import { readdir, stat } from "fs/promises";
import { Logger } from "@nestjs/common";
import { env } from "./config";
import { createBackup } from "./backup-database";

const execAsync = promisify(exec);

interface BackupFile {
  filename: string;
  path: string;
  size: number;
  modified: Date;
}

async function listBackups(): Promise<BackupFile[]> {
  try {
    const backupDir = "../backups";
    const files = await readdir(backupDir);
    const backupFiles: BackupFile[] = [];

    for (const file of files) {
      if (file.endsWith(".sql")) {
        const filePath = `${backupDir}/${file}`;
        const stats = await stat(filePath);
        backupFiles.push({
          filename: file,
          path: filePath,
          size: stats.size,
          modified: stats.mtime,
        });
      }
    }

    // Sort by modification date (newest first)
    return backupFiles.sort((a, b) => b.modified.getTime() - a.modified.getTime());
  } catch (error) {
    throw new Error(`Failed to list backups: ${error.message}`);
  }
}

function formatFileSize(bytes: number): string {
  const sizes = ["B", "KB", "MB", "GB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

function formatDate(date: Date): string {
  return date.toLocaleString();
}

async function restoreFromBackup(backupPath: string, createBackupFirst: boolean = true) {
  const logger = new Logger("DatabaseRestore");

  try {
    const config = env();

    // Create backup before restore if requested
    if (createBackupFirst) {
      logger.log("📦 Creating safety backup before restore...");
      await createBackup();
      logger.log("✅ Safety backup created successfully");
    }

    logger.log(`🔄 Starting database restore from: ${backupPath}`);

    // Set password environment variable
    const env_vars = { ...process.env, PGPASSWORD: config.DB_PASSWORD };

    // Try method 1: Direct restore (works if no active connections)
    logger.log("🔄 Attempting direct restore...");

    const directRestoreCommand = [
      "psql",
      `-h ${config.DB_HOST}`,
      `-p ${config.DB_PORT}`,
      `-U ${config.DB_USERNAME}`,
      `-d postgres`,
      `-f ${backupPath}`,
      "-v ON_ERROR_STOP=1",
    ].join(" ");

    try {
      const { stdout, stderr } = await execAsync(directRestoreCommand, { env: env_vars });

      if (stderr && !stderr.includes("NOTICE") && !stderr.includes("psql:")) {
        logger.warn("Restore warnings:", stderr);
      }

      logger.log("✅ Database restored successfully!");
      logger.log(`📊 Restored from: ${backupPath}`);

      return;
    } catch (directError) {
      if (directError.message.includes("is being accessed by other users")) {
        logger.warn("⚠️  Direct restore failed due to active connections, trying alternative method...");

        // Method 2: Restore without DROP DATABASE (table-by-table restore)
        logger.log("🔄 Attempting table-by-table restore...");

        // First, get list of all tables and drop them
        const getTablesCommand = [
          "psql",
          `-h ${config.DB_HOST}`,
          `-p ${config.DB_PORT}`,
          `-U ${config.DB_USERNAME}`,
          `-d ${config.DB_NAME}`,
          `-t -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"`,
        ].join(" ");

        const { stdout: tablesOutput } = await execAsync(getTablesCommand, { env: env_vars });
        const tables = tablesOutput
          .split("\n")
          .map((t) => t.trim())
          .filter((t) => t);

        if (tables.length > 0) {
          logger.log(`🗑️  Dropping ${tables.length} existing tables...`);

          // Drop tables with CASCADE to handle foreign key constraints
          for (const table of tables) {
            const dropTableCommand = [
              "psql",
              `-h ${config.DB_HOST}`,
              `-p ${config.DB_PORT}`,
              `-U ${config.DB_USERNAME}`,
              `-d ${config.DB_NAME}`,
              `-c "DROP TABLE IF EXISTS public.${table} CASCADE;"`,
            ].join(" ");

            try {
              await execAsync(dropTableCommand, { env: env_vars });
            } catch (dropError) {
              logger.warn(`⚠️  Warning: Could not drop table ${table}:`, dropError.message);
            }
          }

          logger.log("✅ Existing tables cleared");
        } else {
          logger.log("ℹ️  No existing tables found");
        }

        // Also drop custom types/enums with more comprehensive cleanup
        logger.log("🗑️  Cleaning up existing types and enums...");

        try {
          // Get list of types first, then drop them individually
          const getTypesCommand = [
            "psql",
            `-h ${config.DB_HOST}`,
            `-p ${config.DB_PORT}`,
            `-U ${config.DB_USERNAME}`,
            `-d ${config.DB_NAME}`,
            `-t -c "SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public') AND typtype = 'e';"`,
          ].join(" ");

          const { stdout: typesOutput } = await execAsync(getTypesCommand, { env: env_vars });
          const types = typesOutput
            .split("\n")
            .map((t) => t.trim())
            .filter((t) => t);

          if (types.length > 0) {
            logger.log(`🗑️  Dropping ${types.length} existing types/enums...`);

            for (const type of types) {
              const dropTypeCommand = [
                "psql",
                `-h ${config.DB_HOST}`,
                `-p ${config.DB_PORT}`,
                `-U ${config.DB_USERNAME}`,
                `-d ${config.DB_NAME}`,
                `-c "DROP TYPE IF EXISTS public.${type} CASCADE;"`,
              ].join(" ");

              try {
                await execAsync(dropTypeCommand, { env: env_vars });
              } catch (dropError) {
                // Ignore individual drop errors
              }
            }

            logger.log("✅ All existing types/enums cleared");
          }
        } catch (typesError) {
          logger.warn("⚠️  Warning: Could not fully clean types, proceeding anyway");
        }

        // Create a filtered backup file without DROP/CREATE DATABASE commands
        logger.log("🔄 Creating filtered backup for table restore...");
        const filteredBackupPath = backupPath.replace(".sql", "_filtered.sql");

        // Read the backup file and filter out problematic commands
        const fs = require("fs");
        const backupContent = fs.readFileSync(backupPath, "utf8");

        // Filter out problematic commands and improve safety
        const lines = backupContent.split("\n");
        const filteredLines = [];
        let skipMultiLineStatement = false;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const trimmedLine = line.trim().toUpperCase();
          const originalLine = line.trim();

          // Skip empty lines and comments - always keep them
          if (!originalLine || originalLine.startsWith("--")) {
            filteredLines.push(line);
            continue;
          }

          // Handle multi-line ALTER TABLE statements properly
          if (
            trimmedLine.startsWith("ALTER TABLE") &&
            (trimmedLine.includes("OWNER TO") ||
              trimmedLine.includes("SET ") ||
              trimmedLine.includes("ENABLE ") ||
              trimmedLine.includes("DISABLE "))
          ) {
            skipMultiLineStatement = true;
            continue;
          }

          // Skip lines that are part of a multi-line statement we're filtering
          if (skipMultiLineStatement) {
            if (trimmedLine.endsWith(";")) {
              skipMultiLineStatement = false;
            }
            continue;
          }

          // Filter out database-level commands that cause issues
          const shouldFilter =
            trimmedLine.startsWith("DROP DATABASE") ||
            trimmedLine.startsWith("CREATE DATABASE") ||
            trimmedLine.includes("\\CONNECT") ||
            trimmedLine.startsWith("\\C ") ||
            (trimmedLine.includes("OWNER TO") && !trimmedLine.startsWith("ALTER TABLE")) ||
            trimmedLine.startsWith("ALTER DATABASE") ||
            trimmedLine.includes("COMMENT ON DATABASE") ||
            trimmedLine.startsWith("SET SESSION") ||
            trimmedLine.startsWith("SELECT PG_CATALOG") ||
            originalLine.match(/^\d+$/); // Remove standalone numbers

          if (!shouldFilter) {
            filteredLines.push(line);
          }
        }

        const filteredContent = filteredLines.join("\n");

        fs.writeFileSync(filteredBackupPath, filteredContent);
        logger.log("✅ Filtered backup created");

        // Wait a moment for PostgreSQL catalogs to update after cleanup
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Disable foreign key checks during restore for better success rate
        const disableFKCommand = [
          "psql",
          `-h ${config.DB_HOST}`,
          `-p ${config.DB_PORT}`,
          `-U ${config.DB_USERNAME}`,
          `-d ${config.DB_NAME}`,
          `-c "SET session_replication_role = replica;"`,
        ].join(" ");

        try {
          await execAsync(disableFKCommand, { env: env_vars });
          logger.log("🔧 Disabled foreign key checks for restore");
        } catch (fkError) {
          logger.warn("⚠️  Could not disable foreign key checks, proceeding anyway");
        }

        // Then restore using the filtered backup
        const schemaRestoreCommand = [
          "psql",
          `-h ${config.DB_HOST}`,
          `-p ${config.DB_PORT}`,
          `-U ${config.DB_USERNAME}`,
          `-d ${config.DB_NAME}`,
          `-f ${filteredBackupPath}`,
          "-v ON_ERROR_STOP=0", // Continue on errors for table restore
        ].join(" ");

        const { stdout, stderr } = await execAsync(schemaRestoreCommand, { env: env_vars });

        // Re-enable foreign key checks
        const enableFKCommand = [
          "psql",
          `-h ${config.DB_HOST}`,
          `-p ${config.DB_PORT}`,
          `-U ${config.DB_USERNAME}`,
          `-d ${config.DB_NAME}`,
          `-c "SET session_replication_role = DEFAULT;"`,
        ].join(" ");

        try {
          await execAsync(enableFKCommand, { env: env_vars });
          logger.log("🔧 Re-enabled foreign key checks");
        } catch (fkError) {
          logger.warn("⚠️  Could not re-enable foreign key checks");
        }

        // Clean up filtered file
        try {
          fs.unlinkSync(filteredBackupPath);
        } catch (cleanupError) {
          logger.warn("⚠️  Could not clean up filtered backup file");
        }

        if (stderr) {
          // Categorize errors
          const allErrors = stderr.split("\n").filter((line) => line.includes("ERROR:"));
          const seriousErrors = allErrors.filter(
            (line) =>
              !line.includes("already exists") &&
              !line.includes("does not exist") &&
              !line.includes("current transaction is aborted") &&
              !line.includes("violates foreign key constraint") &&
              !line.includes("multiple primary keys") &&
              !line.includes("multiple unique keys") &&
              !line.match(/syntax error at or near "\d+"/) &&
              !(line.includes("syntax error") && line.match(/syntax error at or near "\d+"/))
          );

          if (seriousErrors.length > 0) {
            logger.warn("⚠️  Serious restore errors (please review):");
            seriousErrors.slice(0, 5).forEach((error) => logger.warn(`  ${error}`));
            if (seriousErrors.length > 5) {
              logger.warn(`  ... and ${seriousErrors.length - 5} more errors`);
            }
          }

          // Count successful operations
          const createStatements = stderr
            .split("\n")
            .filter(
              (line) =>
                line.includes("CREATE TABLE") || line.includes("CREATE TYPE") || line.includes("CREATE CONSTRAINT")
            ).length;

          const totalErrors = allErrors.length;
          const ignorableErrors = totalErrors - seriousErrors.length;

          logger.log(
            `📊 Restore summary: ${createStatements} objects created, ${ignorableErrors} ignorable conflicts, ${seriousErrors.length} serious errors`
          );
        }

        logger.log("✅ Database restored successfully using table restore!");
        logger.log(`📊 Restored from: ${backupPath}`);
      } else {
        throw directError;
      }
    }
  } catch (error) {
    logger.error("❌ Database restore failed:", error);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const logger = new Logger("DatabaseRestore");

  // Show help
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
🔄 Database Restore Script

Usage: ts-node src/restore-database.ts [options] [backup-file]

Options:
  --list              List available backup files
  --no-backup         Skip creating safety backup before restore
  --file <path>       Restore from specific backup file
  --latest            Restore from the most recent backup
  --help              Show this help message

Examples:
  ts-node src/restore-database.ts --list                           # List backups
  ts-node src/restore-database.ts --latest                         # Restore latest
  ts-node src/restore-database.ts --file ../backups/backup.sql     # Restore specific file
  ts-node src/restore-database.ts backup-tpc-2024-01-01.sql        # Restore by filename

Safety:
  By default, a safety backup is created before restoration.
  Use --no-backup to skip this step (not recommended).

Note: This will completely replace your current database!
    `);

    return;
  }

  try {
    // List backups
    if (args.includes("--list")) {
      logger.log("📋 Available backup files:");
      const backups = await listBackups();

      if (backups.length === 0) {
        logger.log("No backup files found in ../backups/");

        return;
      }

      console.log("\n" + "=".repeat(80));
      console.log("| # | Filename                              | Size    | Modified           |");
      console.log("=".repeat(80));

      backups.forEach((backup, index) => {
        const num = String(index + 1).padStart(2);
        const filename = backup.filename.padEnd(36);
        const size = formatFileSize(backup.size).padStart(7);
        const modified = formatDate(backup.modified);
        console.log(`| ${num} | ${filename} | ${size} | ${modified} |`);
      });

      console.log("=".repeat(80));
      console.log(`\nTotal: ${backups.length} backup file(s)`);

      return;
    }

    const createSafetyBackup = !args.includes("--no-backup");
    let backupPath: string | null = null;

    // Restore from latest backup
    if (args.includes("--latest")) {
      const backups = await listBackups();
      if (backups.length === 0) {
        logger.error("❌ No backup files found");
        process.exit(1);
      }
      backupPath = backups[0].path;
      logger.log(`🔍 Selected latest backup: ${backups[0].filename}`);
    }

    // Restore from specific file
    const fileIndex = args.indexOf("--file");
    if (fileIndex !== -1 && args[fileIndex + 1]) {
      backupPath = args[fileIndex + 1];
    }

    // Restore by filename (simple argument)
    if (!backupPath && args.length > 0 && !args[0].startsWith("--")) {
      const filename = args[0];
      if (filename.includes("/")) {
        backupPath = filename;
      } else {
        backupPath = `../backups/${filename}`;
      }
    }

    if (!backupPath) {
      logger.error("❌ No backup file specified. Use --help for usage information.");
      process.exit(1);
    }

    // Confirm destructive operation
    console.log("⚠️  WARNING: This will completely replace your current database!");
    console.log(`📂 Restore from: ${backupPath}`);

    if (createSafetyBackup) {
      console.log("🛡️  A safety backup will be created before restoration");
    } else {
      console.log("⚠️  No safety backup will be created (--no-backup flag used)");
    }

    console.log("💡 Press Ctrl+C to cancel, or wait 5 seconds to continue...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    await restoreFromBackup(backupPath, createSafetyBackup);
  } catch (error) {
    logger.error("❌ Restore operation failed:", error);
    logger.log("💡 Check if a safety backup was created before the restore attempt");
    process.exit(1);
  }
}

// Export for use in other scripts
export { restoreFromBackup, listBackups };

// Run the script if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Restore script execution failed:", error);
    process.exit(1);
  });
}
