import { PrismaClient, UserRole } from '@prisma/client';
import { CAPABILITIES } from '../config/capabilities';

const prisma = new PrismaClient();

export class CapabilityService {
    /**
     * Assigns all capabilities marked as defaultOnSignup to a user.
     * @param userId The ID of the user to assign capabilities to.
     */
    static async assignDefaultCapabilities(userId: string): Promise<void> {
        // Use registry as source of truth for what SHOULD be default
        // Filter out deprecated capabilities
        const defaultCapNames = Object.values(CAPABILITIES)
            .filter(c => c.defaultOnSignup && !c.isDeprecated)
            .map(c => c.name);

        if (defaultCapNames.length === 0) return;

        const caps = await prisma.capability.findMany({
            where: { name: { in: defaultCapNames } }
        });

        if (caps.length === 0) return;

        const capsToAdd = caps.map(cap => ({
            userId,
            capabilityId: cap.id
        }));

        await prisma.userCapability.createMany({
            data: capsToAdd,
            skipDuplicates: true // Idempotency
        });
    }

    /**
     * Assigns verified capabilities to a user (typically when KYC is approved).
     * @param userId The ID of the user.
     */
    static async assignVerifiedCapabilities(userId: string): Promise<void> {
        // Verified caps are those that are NOT default but are USER_FACING
        // Or specifically defined as Tier 2 in registry logic.
        // For now, we use the logic: defaultOnSignup=false AND type=USER_FACING
        // Filter out deprecated capabilities
        const verifiedCapNames = Object.values(CAPABILITIES)
            .filter(c => !c.defaultOnSignup && c.type === 'USER_FACING' && !c.isDeprecated)
            .map(c => c.name);

        if (verifiedCapNames.length === 0) return;

        const caps = await prisma.capability.findMany({
            where: { name: { in: verifiedCapNames } }
        });

        const capsToAdd = caps.map(cap => ({
            userId,
            capabilityId: cap.id
        }));

        await prisma.userCapability.createMany({
            data: capsToAdd,
            skipDuplicates: true
        });
    }

    /**
     * Assigns capabilities based on a specific role.
     * Use this for ADMIN, SUPPORT, etc.
     * @param userId The ID of the user.
     * @param role The role to assign capabilities for.
     */
    static async assignRoleCapabilities(userId: string, role: UserRole): Promise<void> {
        console.warn(`[LEGACY_PATH_USAGE] assignRoleCapabilities called for user ${userId} with role ${role}. This logic relies on legacy role mapping.`);

        let roleCapabilities: string[] = [];

        switch (role) {
            case 'ADMIN':
            case 'SUPER_ADMIN':
                roleCapabilities = [
                    CAPABILITIES.VIEW_ADMIN_DASHBOARD.name,
                    CAPABILITIES.MANAGE_USERS.name,
                    CAPABILITIES.APPROVE_KYC.name,
                    CAPABILITIES.MANAGE_PROPERTIES.name,
                    CAPABILITIES.MANAGE_TRANSACTIONS.name,
                    CAPABILITIES.VIEW_AUDIT_LOGS.name
                ];
                break;
            case 'SUPPORT':
                roleCapabilities = [
                    CAPABILITIES.VIEW_ADMIN_DASHBOARD.name,
                    CAPABILITIES.MANAGE_USERS.name,
                    CAPABILITIES.VIEW_AUDIT_LOGS.name
                ];
                break;
            case 'MODERATOR':
                roleCapabilities = [
                    CAPABILITIES.VIEW_ADMIN_DASHBOARD.name,
                    CAPABILITIES.MANAGE_PROPERTIES.name
                ];
                break;
            default:
                return; // USER role handled by default/verified logic
        }

        if (roleCapabilities.length === 0) return;

        const caps = await prisma.capability.findMany({
            where: { name: { in: roleCapabilities } }
        });

        const capsToAdd = caps.map(cap => ({
            userId,
            capabilityId: cap.id
        }));

        await prisma.userCapability.createMany({
            data: capsToAdd,
            skipDuplicates: true
        });
    }

    /**
     * Syncs capabilities based on KYC status.
     * @param userId The ID of the user.
     * @param kycStatus The new KYC status.
     */
    static async syncKycCapabilities(userId: string, kycStatus: string): Promise<void> {
        if (kycStatus === 'VERIFIED') {
            await this.assignVerifiedCapabilities(userId);
        }
    }
}
