import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'http://localhost:8080/api/v1';
const TEST_FILE_PATH = '../clerk-engine/test/Book1.xlsx';

async function testImportFunctionality() {
    console.log('🧪 Testing Import Functionality...\n');

    // Test 1: Check if backend is running by trying to create a workbook
    console.log('1. Testing backend connectivity...');
    try {
        const createResponse = await axios.post(`${API_BASE_URL}/workbook/create`, {
            name: 'test-workbook'
        });
        console.log('✅ Backend is running and accessible');
        const workbookId = createResponse.data.data.workbook_id;
        console.log('✅ Created test workbook with ID:', workbookId);
    } catch (error) {
        console.log('❌ Backend is not accessible:', error.message);
        if (error.response) {
            console.log('Response status:', error.response.status);
            console.log('Response data:', error.response.data);
        }
        return;
    }

    // Test 2: Check if test file exists
    console.log('\n2. Checking test file availability...');
    const testFilePath = path.resolve(__dirname, TEST_FILE_PATH);
    if (!fs.existsSync(testFilePath)) {
        console.log('❌ Test file not found at:', testFilePath);
        console.log('Please ensure the test Excel file exists in the clerk-engine/test directory');
        return;
    }
    console.log('✅ Test file found:', testFilePath);

    // Test 3: Test import API
    console.log('\n3. Testing import API...');
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(testFilePath));

        const importResponse = await axios.post(`${API_BASE_URL}/workbook/import`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
            timeout: 10000, // 10 second timeout
        });

        console.log('✅ Import successful!');
        console.log('Response:', JSON.stringify(importResponse.data, null, 2));
    } catch (error) {
        console.log('❌ Import failed:', error.message);
        if (error.response) {
            console.log('Response status:', error.response.status);
            console.log('Response data:', error.response.data);
        }
        return;
    }

    // Test 4: Test export API
    console.log('\n4. Testing export API...');
    try {
        const exportResponse = await axios.get(`${API_BASE_URL}/export`, {
            responseType: 'blob',
            timeout: 10000,
        });

        console.log('✅ Export successful!');
        console.log('File size:', exportResponse.data.size, 'bytes');
        console.log('Content type:', exportResponse.headers['content-type']);
    } catch (error) {
        console.log('❌ Export failed:', error.message);
        if (error.response) {
            console.log('Response status:', error.response.status);
        }
    }

    console.log('\n🎉 Import functionality test completed!');
}

// Run the test
testImportFunctionality().catch(console.error); 