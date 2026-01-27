
export const FinancialService = {
    /**
     * Calculate Revenue Split for Rental Income
     * Policy: 80/15/5
     * - 80% -> Member Distribution Pool
     * - 15% -> Facility Management (Ops)
     * - 5% -> Platform Fee (Tech)
     */
    calculateRentalSplit(grossIncome: number) {
        return {
            memberPool: grossIncome * 0.80,
            facilityFee: grossIncome * 0.15,
            platformFee: grossIncome * 0.05
        };
    },

    /**
     * Calculate Projected Returns for specific scenarios
     */
    calculateProjections(slots: number, pricePerSlot: number) {
        const investment = slots * pricePerSlot;

        // Scenario A: Conservative (12% Appr + 10% Rent)
        const conservative = {
            value: investment * 1.12,
            rent: investment * 0.10,
            total: (investment * 1.12) + (investment * 0.10)
        };

        // Scenario B: Market Trend (16% Appr + 15% Rent)
        const market = {
            value: investment * 1.16,
            rent: investment * 0.15,
            total: (investment * 1.16) + (investment * 0.15)
        };

        return { conservative, market };
    }
};
