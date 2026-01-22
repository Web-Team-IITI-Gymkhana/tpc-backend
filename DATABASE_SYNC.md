# Database Synchronization Scripts

This document explains how to use the database synchronization and migration scripts for the CAMC Backend.

## Overview

The project includes several scripts to manage database synchronization:

- **sync-database.ts** - Basic database synchronization
- **migrate-database.ts** - Advanced migration with backup support
- **backup-database.ts** - Database backup utility
- **restore-database.ts** - Database restore from backup files

## Quick Start

### 1. Safe Database Sync (Recommended)
```bash
# Preview what will be done
npm run db:migrate:dry

# Create backup and sync database
npm run db:migrate:safe
```

### 2. Basic Operations
```bash
# Simple sync (creates tables if they don't exist)
npm run db:sync

# Update existing schema
npm run db:sync:alter

# Create database backup
npm run db:backup
```

## Scripts Reference

### Database Sync (`db:sync`)
Basic Sequelize sync operations:

```bash
npm run db:sync                    # Safe sync (create missing tables)
npm run db:sync:alter             # Update existing schema
npm run db:sync:force            # ⚠️  DROP and recreate all tables
```

### Database Migration (`db:migrate`)
Advanced migration with additional safety features:

```bash
npm run db:migrate:dry           # Preview changes (no actual changes)
npm run db:migrate:safe          # Migration with automatic backup
npm run db:migrate               # Basic migration

# Manual options:
ts-node src/migrate-database.ts --backup --alter    # Update schema with backup
ts-node src/migrate-database.ts --force --backup    # Full reset with backup
```

### Database Backup (`db:backup`)
Creates a complete PostgreSQL dump:

```bash
npm run db:backup
```

Backups are saved to `../backups/backup-{DB_NAME}-{timestamp}.sql` (outside the code directory)

### Database Restore (`db:restore`)
Restores database from backup files:

```bash
npm run db:restore:list                    # List available backups
npm run db:restore:latest                  # Restore from latest backup
npm run db:restore                         # Interactive restore (requires backup filename)

# Manual options:
ts-node src/restore-database.ts --file ../backups/backup.sql    # Restore specific file
ts-node src/restore-database.ts backup-tpc-2024-01-01.sql       # Restore by filename
ts-node src/restore-database.ts --latest --no-backup            # Skip safety backup
```

## Environment Setup

Ensure these environment variables are configured:

```env
DB_NAME=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

## Safety Recommendations

### Before Production Deployment
1. **Always backup first**: `npm run db:backup`
2. **Test with dry run**: `npm run db:migrate:dry`
3. **Use safe migration**: `npm run db:migrate:safe`

### For Development
1. **Preview changes**: `npm run db:migrate:dry`
2. **Schema updates**: `npm run db:sync:alter`
3. **Fresh start**: `npm run db:sync:force` (⚠️  destroys data)

### For CI/CD
```bash
# Recommended CI/CD pipeline step
npm run db:migrate:safe
```

## Command Reference

| Command | Description | Safety Level |
|---------|-------------|--------------|
| `db:migrate:dry` | Preview changes only | ✅ Very Safe |
| `db:backup` | Create backup | ✅ Safe |
| `db:restore:list` | List available backups | ✅ Safe |
| `db:sync` | Create missing tables | ✅ Safe |
| `db:migrate:safe` | Migration with backup | ✅ Safe |
| `db:sync:alter` | Update schema | ⚠️  Moderate |
| `db:migrate` | Basic migration | ⚠️  Moderate |
| `db:restore:latest` | Restore from latest backup | ❌ Destructive |
| `db:restore` | Restore from backup | ❌ Destructive |
| `db:sync:force` | Drop and recreate | ❌ Destructive |

## Troubleshooting

### Connection Issues
- Verify database is running
- Check environment variables
- Ensure user has proper permissions

### Backup Issues
- Ensure `pg_dump` is installed and in PATH
- Check PostgreSQL user permissions
- Verify disk space for backups

### Migration Failures
- Check the error logs
- Restore from backup: `npm run db:restore:latest` or `npm run db:restore backup-file.sql`
- Review model changes for conflicts

### Restore Issues
- Ensure backup file exists and is not corrupted
- Check PostgreSQL user has CREATE DATABASE permissions
- Verify backup file was created with compatible PostgreSQL version
- Use `--no-backup` flag to skip safety backup if needed

## Model Changes Workflow

When you modify Sequelize models:

1. **Development**:
   ```bash
   npm run db:migrate:dry    # See what will change
   npm run db:sync:alter     # Apply changes
   ```

2. **Staging/Production**:
   ```bash
   npm run db:backup         # Create backup
   npm run db:migrate:dry    # Preview changes
   npm run db:migrate:safe   # Apply with backup
   ```

## Disaster Recovery Workflow

Complete backup and restore cycle:

```bash
# 1. List available backups
npm run db:restore:list

# 2. Create current backup before changes
npm run db:backup

# 3. If something goes wrong, restore from backup
npm run db:restore:latest              # Restore from most recent
# or
npm run db:restore backup-file.sql     # Restore specific backup
```

## Integration with Existing Scripts

The sync scripts work alongside your existing `upload:data` script:

```bash
# Typical workflow
npm run db:migrate:safe     # Sync database schema
npm run upload:data file.xlsx 2024 "Computer Science" 1  # Upload data
```