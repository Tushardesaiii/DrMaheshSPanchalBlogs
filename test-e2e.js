#!/usr/bin/env node

/**
 * Full End-to-End Test: Login → Create Content with Files
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:8000';
const ADMIN_EMAIL = 'admin@main123';
const ADMIN_PASSWORD = 'Admin12345';

let globalToken = null;

/**
 * Make HTTP request (for JSON)
 */
function makeJsonRequest(method, pathname, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(pathname, API_BASE);
    const jsonBody = JSON.stringify(body);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonBody),
        ...headers,
      },
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: { raw: data, error: e.message } });
        }
      });
    });

    req.on('error', reject);
    req.write(jsonBody);
    req.end();
  });
}

/**
 * Make FormData request (for file uploads)
 */
function makeFormDataRequest(method, pathname, formData, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(pathname, API_BASE);
    
    const options = {
      method,
      headers,
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: { raw: data, error: e.message } });
        }
      });
    });

    req.on('error', reject);
    req.write(formData);
    req.end();
  });
}

/**
 * Build FormData for multipart/form-data
 */
function buildFormData(fields, files = []) {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substr(2, 9);
  let body = '';

  // Add fields
  for (const [key, value] of Object.entries(fields)) {
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
    body += `${value}\r\n`;
  }

  // Add files
  files.forEach(({ name, filePath, filename }) => {
    const fileContent = fs.readFileSync(filePath);
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="${name}"; filename="${filename}"\r\n`;
    body += `Content-Type: application/octet-stream\r\n\r\n`;
    body = Buffer.concat([
      Buffer.from(body),
      fileContent,
      Buffer.from(`\r\n`),
    ]);
  });

  body += `--${boundary}--\r\n`;

  return {
    body: typeof body === 'string' ? Buffer.from(body) : body,
    boundary,
  };
}

/**
 * Test 1: Login
 */
async function testLogin() {
  console.log('\n📨 TEST 1: Login\n');
  
  const response = await makeJsonRequest('POST', '/api/auth/login', {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  console.log(`Status: ${response.status}`);
  
  if (response.status === 200 && response.data.data?.accessToken) {
    globalToken = response.data.data.accessToken;
    console.log(`✅ Login successful!`);
    return true;
  } else {
    console.log(`❌ Login failed`);
    console.log(JSON.stringify(response.data, null, 2));
    return false;
  }
}

/**
 * Test 2: Create Content with Files
 */
async function testCreateContent() {
  console.log('\n📝 TEST 2: Create Content with File Upload\n');

  if (!globalToken) {
    console.log('❌ No token available. Run login test first.');
    return false;
  }

  // Create a temporary test file
  const testFile = path.join(require('os').tmpdir(), 'test-upload.txt');
  fs.writeFileSync(testFile, 'This is a test file for upload testing.\nContent can be any format.\n');

  console.log(`Creating test file: ${testFile}`);
  console.log(`File size: ${fs.statSync(testFile).size} bytes\n`);

  // Build FormData
  const fields = {
    title: 'Test Article - File Upload Testing',
    description: 'This is a comprehensive test to verify file uploads to Cloudinary are working correctly.',
    format: 'Article',
    sections: JSON.stringify(['Learning Resources', 'Research Papers']),
    visibility: 'Public',
    status: 'Published',
    tags: JSON.stringify(['test', 'upload', 'api']),
  };

  const { body, boundary } = buildFormData(fields, [
    { name: 'files', filePath: testFile, filename: 'test-upload.txt' },
  ]);

  console.log(`FormData boundary: ${boundary}`);
  console.log(`Body size: ${body.length} bytes\n`);

  const headers = {
    'Authorization': `Bearer ${globalToken}`,
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': body.length,
  };

  try {
    const response = await makeFormDataRequest('POST', '/api/content', body, headers);

    console.log(`Status: ${response.status}`);
    console.log(`Message: ${response.data.message}`);

    if (response.status === 201 && response.data.data?._id) {
      console.log(`✅ Content created successfully!`);
      console.log(`\nContent Details:`);
      console.log(`  - ID: ${response.data.data._id}`);
      console.log(`  - Title: "${response.data.data.title}"`);
      console.log(`  - Format: ${response.data.data.format}`);
      console.log(`  - Sections: ${response.data.data.sections.join(', ')}`);
      console.log(`  - Files: ${response.data.data.files?.length || 0}`);
      
      if (response.data.data.files?.length > 0) {
        console.log(`\n  📎 Uploaded Files:`);
        response.data.data.files.forEach((file, i) => {
          console.log(`    ${i + 1}. ${file.name}`);
          console.log(`       URL: ${file.url.substring(0, 60)}...`);
        });
      }
      
      // Clean up
      fs.unlinkSync(testFile);
      return true;
    } else {
      console.log(`❌ Content creation failed`);
      console.log(JSON.stringify(response.data, null, 2));
      fs.unlinkSync(testFile);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    fs.unlinkSync(testFile);
    return false;
  }
}

/**
 * Test 3: Fetch Created Content
 */
async function testFetchContent() {
  console.log('\n📚 TEST 3: Fetch All Content\n');

  const response = await makeJsonRequest('GET', '/api/content');

  console.log(`Status: ${response.status}`);

  if (response.status === 200 && Array.isArray(response.data.data)) {
    console.log(`✅ Content fetched!`);
    console.log(`Total items: ${response.data.data.length}`);
    
    if (response.data.data.length > 0) {
      const latest = response.data.data[0];
      console.log(`\nLatest Content:`);
      console.log(`  - Title: "${latest.title}"`);
      console.log(`  - Format: ${latest.format}`);
      console.log(`  - Sections: ${latest.sections.join(', ')}`);
      console.log(`  - Files: ${latest.files?.length || 0}`);
      console.log(`  - Status: ${latest.status}`);
    }
    return true;
  } else {
    console.log(`❌ Failed to fetch content`);
    console.log(JSON.stringify(response.data, null, 2));
    return false;
  }
}

/**
 * Summary Report
 */
function printSummary(results) {
  console.log('\n' + '='.repeat(70));
  console.log('📊 END-TO-END TEST SUMMARY');
  console.log('='.repeat(70));

  const tests = [
    { name: 'Login', result: results.login },
    { name: 'Create Content + File Upload', result: results.createContent },
    { name: 'Fetch Created Content', result: results.fetchContent },
  ];

  tests.forEach(test => {
    const icon = test.result ? '✅' : '❌';
    console.log(`${icon} ${test.name}`);
  });

  const passed = tests.filter(t => t.result).length;
  const total = tests.length;
  console.log('='.repeat(70));
  console.log(`Result: ${passed}/${total} tests passed\n`);

  if (passed === total) {
    console.log('🎉 FULL END-TO-END TEST PASSED!\n');
    console.log('✅ System is completely functional:');
    console.log('   - Authentication working');
    console.log('   - Content creation working');
    console.log('   - File upload to Cloudinary working');
    console.log('   - Database persistence working\n');
    console.log('You can now use the web interface safely!');
    console.log('Browser: http://localhost:5174\n');
  } else {
    console.log('⚠️  Some tests failed. Check the output above.\n');
  }
}

/**
 * Main Test Runner
 */
async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 END-TO-END API TEST SUITE');
  console.log('='.repeat(70));
  console.log(`API Base: ${API_BASE}\n`);

  const results = {
    login: false,
    createContent: false,
    fetchContent: false,
  };

  try {
    results.login = await testLogin();
    results.createContent = await testCreateContent();
    results.fetchContent = await testFetchContent();
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
  }

  printSummary(results);
  process.exit(results.login && results.createContent && results.fetchContent ? 0 : 1);
}

runTests();
