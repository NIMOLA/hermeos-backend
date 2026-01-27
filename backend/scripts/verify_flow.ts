
import axios from 'axios';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

const API_URL = 'http://localhost:5000/api';
// Use the credentials from reset_admin.ts or defaults
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hermeos.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

// Test User Credentials
const TEST_USER = {
    email: 'test_investor@hermeos.com',
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'Investor',
    phone: '08012345678'
};

// Create readline interface for manual pause
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query: string) => new Promise(resolve => rl.question(query, resolve));

// Axios instance with cookie support (if needed, though we mainly use Bearer tokens)
const client = axios.create({
    baseURL: API_URL,
    validateStatus: () => true // Don't throw on errors, let us handle them
});

let adminToken = '';
let userToken = '';
let createdPropertyId = '';
let activeReference = '';

async function main() {
    console.log('🚀 Starting Hermeos Payment Flow Verification...');
    console.log('------------------------------------------------');

    // 1. Admin Login & Setup
    console.log('\n🔐 [1/6] Logging in as Admin...');
    const adminLogin = await client.post('/auth/login', {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
    });

    if (adminLogin.status !== 200) {
        console.error('❌ Admin login failed:', adminLogin.data);
        process.exit(1);
    }
    adminToken = adminLogin.data.token;
    console.log('✅ Admin logged in.');

    // 2. Create Property
    console.log('\nbuilding [2/6] Creating Test Property...');
    const propertyData = {
        name: `Test Property ${Date.now()}`,
        location: 'Lekki Phase 1, Lagos',
        totalValue: 50000000,
        totalUnits: 1000,
        pricePerUnit: 50000, // 50k per unit
        description: 'Automated test property',
        type: 'Residential',
        roi: 15.5
    };

    const createProp = await client.post('/properties', propertyData, {
        headers: { Authorization: `Bearer ${adminToken}` }
    });

    if (createProp.status !== 201) {
        console.error('❌ Property creation failed:', createProp.data);
        process.exit(1);
    }
    createdPropertyId = createProp.data.data.id;
    console.log(`✅ Property created: ${createdPropertyId} (${propertyData.name})`);

    // 2b. Publish Property (if needed - checking controller typically requires published for public, but maybe not for purchase logic? Let's publish to be safe)
    // Actually, user might need it to be published to 'see' it, but direct ID access might check status.
    // Let's publish it.
    console.log('   -> Publishing property...');
    await client.put(`/properties/${createdPropertyId}/publish`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('   -> Property published.');


    // 3. User Setup (Login or Register)
    console.log('\n👤 [3/6] Setting up Test Investor...');
    let userLogin = await client.post('/auth/login', {
        email: TEST_USER.email,
        password: TEST_USER.password
    });

    if (userLogin.status === 200) {
        console.log('   -> User exists, logged in.');
        userToken = userLogin.data.token;
    } else {
        console.log('   -> User does not exist, registering...');
        const register = await client.post('/auth/signup', TEST_USER);
        if (register.status === 201) {
            console.log('   -> User registered.');
            userToken = register.data.token;

            // Auto-verify KYC if needed for purchase (Controller check: if (!user.isVerified ...))
            // We need to verify this user manually via Admin Key? Or direct DB?
            // Since we have admin token, let's verify them.
            // Need user ID.
            // Login again to get ID or use register response?
            // Register response usually sends token. decoding or just login again is eager.
            // Let's login newly created user to be sure.
            userLogin = await client.post('/auth/login', {
                email: TEST_USER.email,
                password: TEST_USER.password
            });
            userToken = userLogin.data.token;
        } else {
            console.error('❌ User registration failed:', register.data);
            process.exit(1);
        }
    }

    // 3b. Force Verify KYC for User (Requires Admin)
    // We need the user ID.
    const userProfile = await client.get('/auth/me', {
        headers: { Authorization: `Bearer ${userToken}` }
    });
    const userId = userProfile.data.data.id;

    console.log(`   -> Verifying User KYC (ID: ${userId})...`);
    // Assuming we have an endpoint for this, or we use the adminManagement controller 'suspendUser' logic? 
    // Wait, the `adminManagement.controller.ts` has `updateUserProfile` but not explicit "verify user" endpoint exposed easily?
    // Actually `backend/scripts/reset_admin.ts` sets `isVerified: true`.
    // Let's direct update via Prisma if this was a backend script, but this is an HTTP script.
    // Let's try to update status via direct DB access for this script only OR use the admin capability if available.
    // There is no explicit "verify user" API endpoint in the list I saw earlier (list_dir).
    // WORKAROUND: We will assume the user needs to be verified. 
    // If this fails, the script will tell us. 
    // Actually, `payment.controller.ts` line 31: `if (!user.isVerified && user.role === 'USER')`
    // We can use Prisma directly here since we are in the backend folder!

    // Dynamic import prisma client because it's a script in the backend folder
    // But we are running with 'tsx', so we can import.
    // We'll keep it simple: if API fails with 403 KYC, we know why.
    // BETTER: Use direct Prisma update since we are 'developers' running this script.
    try {
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        await prisma.user.update({
            where: { id: userId },
            data: { isVerified: true, kycStatus: 'verified' }
        });
        console.log('   -> User KYC manually verified via DB access.');
        await prisma.$disconnect();
    } catch (e) {
        console.warn('   ⚠️ Could not direct verify user (Prisma error). Flow might fail if KYC is strictly enforced.');
    }


    // 4. Initialize Payment
    console.log('\n💸 [4/6] Initializing Investment (2 Units)...');
    const unitsToBuy = 2;
    // Price = 50k * 2 = 100k
    const amountToPay = 50000 * 2;

    const initPayment = await client.post('/payments/card/initialize', {
        propertyId: createdPropertyId,
        units: unitsToBuy,
        amount: amountToPay
    }, {
        headers: { Authorization: `Bearer ${userToken}` }
    });

    if (initPayment.status !== 200) {
        console.error('❌ Payment initialization failed:', initPayment.data);
        process.exit(1);
    }

    const { authorizationUrl, reference, accessCode } = initPayment.data.data;
    activeReference = reference;
    console.log(`✅ Payment Initialized! Reference: ${reference}`);
    console.log('------------------------------------------------');
    console.log(`🔗 AUTHORIZATION URL: ${authorizationUrl}`);
    console.log('------------------------------------------------');


    // 5. Manual Action
    console.log('\n🛑 [5/6] MANUAL ACTION REQUIRED');
    console.log('1. Click/Open the URL above in your browser.');
    console.log('2. Choose "Success" (if using Paystack Test Bank) or use a Test Card.');
    console.log('3. Complete the payment transaction.');
    console.log('4. ONE SECOND after you see "Payment Successful", press ENTER here.');

    await askQuestion('\nPress ENTER after payment is complete...');


    // 6. Verify Payment
    console.log('\n🔍 [6/6] Verifying Payment on Backend...');
    const verify = await client.get(`/payments/card/verify/${activeReference}`, {
        headers: { Authorization: `Bearer ${userToken}` }
    });

    if (verify.status === 200) {
        console.log('✅ Payment Verification SUCCESSFUL!');
        console.log('   -> Ownership Created:', verify.data.data.ownershipId);
        console.log('   -> Units:', verify.data.data.units);

        console.log('\n🎉 TEST COMPLETED SUCCESSFULLY.');
    } else {
        console.error('❌ Payment Verification Failed:', verify.data);
        console.log('   (Note: If you didn\'t actually pay, this is expected)');
    }

    process.exit(0);
}

main().catch(err => {
    console.error('Script error:', err);
    process.exit(1);
});
