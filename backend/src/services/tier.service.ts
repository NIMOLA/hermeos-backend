import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const TierService = {
    /**
     * Calculate and update user tier based on total active slots.
     * Logic:
     * - 1-499 Slots: Tier 1 (Yield Partner)
     * - 500-999 Slots: Tier 2 (Contributing Partner)
     * - 1000+ Slots: Tier 3 (Guardian Partner)
     */
    async updateUserTier(userId: string): Promise<string> {
        // 1. Get total active slots
        const ownerships = await prisma.ownership.findMany({
            where: {
                userId,
                status: { in: ['active', 'locked', 'developer_reserve'] }
            }
        });

        const totalSlots = ownerships.reduce((sum, o) => sum + o.units, 0);

        // 2. Determine Tier
        let newTier = 'Standard'; // Default if 0
        if (totalSlots > 0 && totalSlots < 500) {
            newTier = 'Tier 1'; // Yield Partner
        } else if (totalSlots >= 500 && totalSlots < 1000) {
            newTier = 'Tier 2'; // Contributing Partner
        } else if (totalSlots >= 1000) {
            newTier = 'Tier 3'; // Guardian Partner
        }

        // 3. Update User if changed
        // We fetch current tier first to avoid unnecessary writes? Or just write.
        await prisma.user.update({
            where: { id: userId },
            data: { tier: newTier }
        });

        return newTier;
    },

    /**
     * Get formatting details for a tier string
     */
    getTierDetails(tier: string) {
        switch (tier) {
            case 'Tier 3':
                return { label: 'Guardian Partner', badge: 'Diamond/Platinum', color: 'text-purple-600' };
            case 'Tier 2':
                return { label: 'Contributing Partner', badge: 'Gold', color: 'text-amber-500' };
            case 'Tier 1':
            default:
                return { label: 'Yield Partner', badge: 'Blue', color: 'text-blue-500' };
        }
    }
};
