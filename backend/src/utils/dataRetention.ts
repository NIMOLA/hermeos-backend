import { PrismaClient } from '@prisma/client';
import { logSecurityEvent } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Data Retention Policy
 * - Audit logs: 90 days
 * - Security logs: 90 days
 * - Financial logs: 7 years (regulatory requirement)
 * - User sessions: 30 days
 * - Deleted users: 90 days (soft delete)
 */

/**
 * Clean up old audit logs (90 days)
 */
export async function cleanupAuditLogs() {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    try {
        const result = await prisma.auditLog.deleteMany({
            where: {
                createdAt: {
                    lt: ninetyDaysAgo
                }
            }
        });

        logSecurityEvent('Audit logs cleaned up', {
            deletedCount: result.count,
            olderThan: ninetyDaysAgo.toISOString()
        });

        return result.count;
    } catch (error) {
        console.error('Error cleaning audit logs:', error);
        throw error;
    }
}

/**
 * Clean up old sessions (30 days)
 */
export async function cleanupOldSessions() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
        // If you have a Session model, clean it up
        // For now, we'll just log
        logSecurityEvent('Session cleanup executed', {
            olderThan: thirtyDaysAgo.toISOString()
        });

        return 0;
    } catch (error) {
        console.error('Error cleaning sessions:', error);
        throw error;
    }
}

/**
 * Permanently delete soft-deleted users (90 days after deletion)
 */
export async function cleanupDeletedUsers() {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    try {
        const result = await prisma.user.deleteMany({
            where: {
                deletedAt: {
                    not: null,
                    lt: ninetyDaysAgo
                }
            }
        });

        logSecurityEvent('Deleted users cleaned up', {
            deletedCount: result.count,
            olderThan: ninetyDaysAgo.toISOString()
        });

        return result.count;
    } catch (error) {
        console.error('Error cleaning deleted users:', error);
        throw error;
    }
}

/**
 * Run all cleanup tasks
 */
export async function runDataRetentionCleanup() {
    console.log('Starting data retention cleanup...');

    const results = {
        auditLogs: 0,
        sessions: 0,
        deletedUsers: 0,
        timestamp: new Date().toISOString()
    };

    try {
        results.auditLogs = await cleanupAuditLogs();
        results.sessions = await cleanupOldSessions();
        results.deletedUsers = await cleanupDeletedUsers();

        console.log('Data retention cleanup completed:', results);

        logSecurityEvent('Data retention cleanup completed', results);

        return results;
    } catch (error) {
        console.error('Error during data retention cleanup:', error);
        throw error;
    }
}

// Export for cron job usage
export default runDataRetentionCleanup;
