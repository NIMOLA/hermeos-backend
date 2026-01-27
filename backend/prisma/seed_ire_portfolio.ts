import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding The Ire Portfolio (Series I)...');

    // 1. Find or Create Admin User (Manymiles_Consolidated)
    const adminEmail = 'admin@hermeos.com';
    let adminUser = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!adminUser) {
        console.log('⚠️ Admin user not found. Creating default admin...');
        // In a real scenario, use hashed password. For dev seed: use a known hash or placeholder
        // Assuming bcrypt logic is elsewhere, we'll put a placeholder. 
        // If auth relies on hash, this user might not be login-able without a real hash.
        // relying on existing seed or manual creation if possible.
        // For now, checking if there is ANY admin.
        const firstAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (firstAdmin) {
            adminUser = firstAdmin;
            console.log(`Using existing admin: ${adminUser.email}`);
        } else {
            throw new Error("No Admin user found to assign Developer Reserve. Please run initial seed first.");
        }
    }

    // 2. Create The Ire Portfolio Asset
    const portfolioData = {
        name: "The Ire Portfolio (Series I)",
        description: "The Underlying Asset: Baruch Luxury Apartments + Solar Grid (Lekki-Ajah). A Cooperative Asset managing a portfolio of 10 Luxury Units.",
        address: "Lekki-Ajah, Lagos",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
        location: "Baruch Apartments",
        totalUnits: 4660, // Total Slots
        availableUnits: 4194, // 4660 - 466 (10%)
        pricePerUnit: 100000, // 100k per slot
        totalValue: 466000000, // 466 Million
        expectedReturn: 16.00, // Target (Market Trend)
        expectedAnnualIncome: 551000, // Target Result
        propertyType: "Cooperative_Asset",
        status: "PUBLISHED" as const, // Active

        // Detailed Specs
        amenities: ["Solar Grid", "Luxury Finishing", "Facility Management"],
        locationHighlights: ["Lekki-Ajah Corridor", "High Rental Demand Area"],

        // Financial Engine Data
        financialDetails: {
            valuation: 466000000,
            structure: "4,660 Slots @ ₦100,000",
            launchStrategy: "10% Retained / 90% Public",
            scenarios: {
                conservative: {
                    label: "Conservative (The Floor)",
                    appreciation: 12,
                    rentGrowth: 10,
                    result: 387000
                },
                marketTrend: {
                    label: "Market Trend (The Target)",
                    appreciation: 16,
                    rentGrowth: 15,
                    result: 551000
                }
            },
            revenueSplit: {
                partners: 80,
                ops: 15,
                tech: 5
            }
        },
        images: [
            "https://images.unsplash.com/photo-1600596542815-e3289cab6558?auto=format&fit=crop&q=80&w=1600", // Placeholder Luxury Apartment
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1600"
        ]
    };

    // Upsert Property to avoid duplicates
    const existingProperty = await prisma.property.findFirst({
        where: { name: portfolioData.name }
    });

    let property;
    if (existingProperty) {
        console.log('🔄 Updating existing portfolio...');
        property = await prisma.property.update({
            where: { id: existingProperty.id },
            data: portfolioData
        });
    } else {
        console.log('✨ Creating new portfolio...');
        property = await prisma.property.create({
            data: portfolioData
        });
    }

    // 3. Assign 10% Developer Reserve (466 Slots)
    const reserveSlots = 466;
    const reserveValue = reserveSlots * portfolioData.pricePerUnit;

    const existingOwnership = await prisma.ownership.findUnique({
        where: {
            userId_propertyId: {
                userId: adminUser.id,
                propertyId: property.id
            }
        }
    });

    if (!existingOwnership) {
        console.log(`💼 Assigning ${reserveSlots} slots to Admin (Developer Reserve)...`);
        await prisma.ownership.create({
            data: {
                userId: adminUser.id,
                propertyId: property.id,
                units: reserveSlots,
                acquisitionPrice: reserveValue,
                currentValue: reserveValue,
                status: "developer_reserve" // Special status or just 'active'
            }
        });
    } else {
        console.log('✅ Developer reserve already assigned.');
    }

    console.log('🚀 Ire Portfolio Seed Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
