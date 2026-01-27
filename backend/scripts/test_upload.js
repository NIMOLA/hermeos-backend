
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

const API_URL = 'http://localhost:5000/api/upload';
// We need a valid token. Since I cannot easily get one from here without logging in...
// specific to this environment, I'll try to just check if I can hit the endpoint.
// But it is protected.

// Let's rely on the frontend behaving.
// But I can create a small test file in uploads manually to see if write permissions work?
// No, I want to test the full POST flow.

// I will create a test script that:
// 1. Logs in as super admin
// 2. Uploads a dummy file

const TEST_FILE_PATH = path.join(__dirname, 'test-image.png');
// Create a dummy image file
fs.writeFileSync(TEST_FILE_PATH, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64'));

async function testUpload() {
    try {
        console.log("1. Logging in...");
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'superadmin@hermeos.com',
            password: 'SuperAdmin@2026!'
        });
        const token = loginRes.data.data.token;
        console.log("Logged in. Token acquired.");

        console.log("2. Uploading file...");
        const formData = new FormData();
        formData.append('file', fs.createReadStream(TEST_FILE_PATH));

        const uploadRes = await axios.post(API_URL, formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("Upload Success:", uploadRes.data);

    } catch (error) {
        console.error("Upload Failed:", error.response ? error.response.data : error.message);
    } finally {
        if (fs.existsSync(TEST_FILE_PATH)) fs.unlinkSync(TEST_FILE_PATH);
    }
}

testUpload();
