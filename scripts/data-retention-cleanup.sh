#!/bin/bash
# Data Retention Cleanup Cron Job
# Schedule: 0 3 * * 0 (Every Sunday at 3 AM)

set -e

LOG_FILE="/var/log/hermeos-data-retention.log"
PROJECT_DIR="/var/www/hermeos-backend"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting data retention cleanup..."

cd "$PROJECT_DIR"

# Run cleanup via Node script
docker compose exec -T backend node -e "
const { runDataRetentionCleanup } = require('./dist/utils/dataRetention');
runDataRetentionCleanup()
    .then(results => {
        console.log('Cleanup completed:', results);
        process.exit(0);
    })
    .catch(error => {
        console.error('Cleanup failed:', error);
        process.exit(1);
    });
"

if [ $? -eq 0 ]; then
    log "✓ Data retention cleanup completed successfully"
else
    log "✗ Data retention cleanup failed"
    exit 1
fi

log "----------------------------------------"

exit 0
