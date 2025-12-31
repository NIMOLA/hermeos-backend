#!/bin/bash
# Hermeos Platform - Automated Database Backup Script
# Schedule with cron: 0 2 * * * /root/backup-hermeos-db.sh

set -e

# Configuration
BACKUP_DIR="/backups/hermeos"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
PROJECT_DIR="/var/www/hermeos-backend"
LOG_FILE="/var/log/hermeos-backup.log"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting Hermeos database backup..."

# Database backup
log "Backing up PostgreSQL database..."
cd "$PROJECT_DIR"

docker compose exec -T db pg_dump -U postgres hermeos | gzip > "$BACKUP_DIR/hermeos_db_$DATE.sql.gz"

if [ $? -eq 0 ]; then
    log "✓ Database backup successful: hermeos_db_$DATE.sql.gz"
    DB_SIZE=$(du -h "$BACKUP_DIR/hermeos_db_$DATE.sql.gz" | cut -f1)
    log "  Backup size: $DB_SIZE"
else
    log "✗ Database backup failed!"
    exit 1
fi

# Backup environment files
log "Backing up configuration files..."
tar -czf "$BACKUP_DIR/hermeos_config_$DATE.tar.gz" \
    -C "$PROJECT_DIR" \
    .env \
    backend/.env \
    docker-compose.yml \
    2>/dev/null || log "  Warning: Some config files may be missing"

if [ -f "$BACKUP_DIR/hermeos_config_$DATE.tar.gz" ]; then
    log "✓ Configuration backup successful"
else
    log "⚠ Configuration backup partially failed"
fi

# Remove old backups
log "Cleaning up old backups (older than $RETENTION_DAYS days)..."
DELETED_COUNT=$(find "$BACKUP_DIR" -name "hermeos_*.gz" -mtime +$RETENTION_DAYS -type f -delete -print | wc -l)
log "  Deleted $DELETED_COUNT old backup(s)"

# List recent backups
log "Recent backups:"
ls -lh "$BACKUP_DIR" | tail -n 10 | tee -a "$LOG_FILE"

# Calculate total backup size
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
log "Total backup size: $TOTAL_SIZE"

# Optional: Upload to cloud storage (uncomment and configure)
# log "Uploading to cloud storage..."
# aws s3 sync "$BACKUP_DIR" s3://hermeos-backups/ --delete
# rclone sync "$BACKUP_DIR" remote:hermeos-backups

log "Backup completed successfully!"
log "----------------------------------------"

# Exit successfully
exit 0
