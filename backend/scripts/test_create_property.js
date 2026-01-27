
const axios = require('axios');

async function testCreateProperty() {
    try {
        console.log("1. Logging in...");
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'superadmin@hermeos.com',
            password: 'SuperAdmin@2026!'
        });
        const token = loginRes.data.data.token;
        console.log("Logged in.");

        console.log("2. Creating Property...");

        // Exact payload structure from frontend
        const payload = {
            name: "Test Property " + Date.now(),
            propertyType: "Multi-family Residential",
            yearBuilt: 2024,
            description: "Test Description",
            address: "123 Test St",
            city: "Test City",
            state: "Test State",
            postalCode: "123456",
            totalValue: 1000000,
            pricePerUnit: 1000,
            totalUnits: 1000,
            minInvestment: 1000,
            expectedReturn: 12.5,
            status: "PUBLISHED",
            images: [],
            amenities: ["Pool", "Gym"],
            locationHighlights: ["Near CBD"],
            floorLevel: "5th Floor",
            size: "1200 sqm",
            bedrooms: 2,
            bathrooms: 2,
            location: "Test City, Test State", // Constructed field
            // startDate: new Date() // REMOVED in frontend
        };

        const res = await axios.post('http://localhost:5000/api/properties', payload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log("Create Success:", res.data);

    } catch (error) {
        console.error("Create Failed:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testCreateProperty();
