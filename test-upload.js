import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

const TEST_EMAIL = 'admin@main123';
const TEST_PASSWORD = 'Admin12345';
const API_BASE = 'http://localhost:8000';

async function test() {
  try {
    console.log('🔍 Testing content upload flow...\n');
    
    // Step 1: Login
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginResponse.status, loginData.message);
    
    if (!loginData.data?.accessToken) {
      console.error('❌ No token received');
      return;
    }
    
    const token = loginData.data.accessToken;
    console.log('✅ Token received:', token.substring(0, 20) + '...\n');
    
    // Step 2: Create test file
    console.log('2️⃣ Creating test file...');
    const testFile = '/tmp/test.txt';
    fs.writeFileSync(testFile, 'Test content for upload');
    console.log('✅ Test file created\n');
    
    // Step 3: Upload content with file
    console.log('3️⃣ Uploading content...');
    const form = new FormData();
    form.append('title', 'Test Article');
    form.append('description', 'This is a test article for file upload');
    form.append('format', 'Article');
    form.append('sections', JSON.stringify(['Learning Resources']));
    form.append('visibility', 'Public');
    form.append('status', 'Published');
    form.append('tags', JSON.stringify([]));
    form.append('files', fs.createReadStream(testFile));
    
    console.log('FormData prepared, sending...');
    
    const uploadResponse = await fetch(`${API_BASE}/api/content`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: form,
    });
    
    console.log('Response status:', uploadResponse.status);
    const uploadData = await uploadResponse.json();
    console.log('Response:', JSON.stringify(uploadData, null, 2));
    
    if (uploadData.success || uploadResponse.status === 201) {
      console.log('✅ Content uploaded successfully!\n');
      console.log('Created content:', uploadData.data?.title);
      console.log('Files:', uploadData.data?.files?.length || 0);
    } else {
      console.error('❌ Upload failed:', uploadData.message);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

test();
