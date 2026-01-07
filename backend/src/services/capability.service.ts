import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export class CapabilityService {
    /**
     * Assigns all capabilities marked as defaultOnSignup to a user.
     * @param userId The ID of the user to assign capabilities to.
     */
    static async assignDefaultCapabilities(userId: string): Promise<void> {
        const defaultCaps = await prisma.capability.findMany({
            where: { defaultOnSignup: true }
        });

        if (defaultCaps.length === 0) return;

        const capsToAdd = defaultCaps.map(cap => ({
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
        const verifiedCaps = await prisma.capability.findMany({
            where: { defaultOnSignup: false }
        });

        if (verifiedCaps.length === 0) return;

        const capsToAdd = verifiedCaps.map(cap => ({
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
        let roleCapabilities: string[] = [];

        switch (role) {
            case 'ADMIN':
            case 'SUPER_ADMIN':
                roleCapabilities = [
                    'view_admin_dashboard',
                    'manage_users',
                    'approve_kyc',
                    'manage_properties',
                    'manage_transactions',
                    'view_audit_logs'
                ];
                break;
            case 'SUPPORT':
                roleCapabilities = [
                    'view_admin_dashboard',
                    'manage_users',
                    'view_audit_logs'
                ];
                break;
            case 'MODERATOR':
                roleCapabilities = [
                    'view_admin_dashboard',
                    'manage_properties'
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
        // Logic for revoking capabilities could go here if needed
        // but removing capabilities is riskier, so we leave it additive for now.
    }
}
