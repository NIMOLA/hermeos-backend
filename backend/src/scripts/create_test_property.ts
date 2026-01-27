
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Creating test property...');

    const property = await prisma.property.create({
        data: {
            name: 'Blue Water Residence',
            description: 'A premium waterfront development offering high-yield returns. Located in the heart of Lekki Phase 1, this residential asset is perfect for passive income seekers.',
            address: '12 Admiralty Way',
            city: 'Lekki',
            state: 'Lagos',
            country: 'Nigeria',
            location: 'Lekki Phase 1, Lagos',
            totalUnits: 1000,
            availableUnits: 1000,
            pricePerUnit: 50000.00, // Clean number
            totalValue: 50000000.00,
            expectedReturn: 12.5,
            expectedAnnualIncome: 6250000.00,
            propertyType: 'Residential',
            bedrooms: 2,
            bathrooms: 2,
            size: '120 sqm',
            status: 'PUBLISHED',
            images: [
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop'
            ],
            amenities: ['Swimming Pool', '24/7 Power', 'Gym', 'Security'],
            locationHighlights: ['Near Circle Mall', 'Waterfront View']
        }
    });

    console.log(`Created property: ${property.name}`);
    console.log(`ID: ${property.id}`);
    console.log(`Price: ₦${property.pricePerUnit}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
