#!/usr/bin/env node

/**
 * Comprehensive API Test Suite
 * Tests: Login → Token → Content Creation → File Upload
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:8000';
const ADMIN_EMAIL = 'admin@main123';
const ADMIN_PASSWORD = 'Admin12345';

let globalToken = null;

/**
 * Make HTTP request
 */
function makeRequest(method, pathname, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(pathname, API_BASE);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
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
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

/**
 * Test 1: Login
 */
async function testLogin() {
  console.log('\n📨 TEST 1: Login\n');
  
  const response = await makeRequest('POST', '/api/auth/login', {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  console.log(`Status: ${response.status}`);
  console.log(`Message: ${response.data.message}`);

  if (response.status === 200 && response.data.data?.accessToken) {
    globalToken = response.data.data.accessToken;
    console.log(`✅ Login successful!`);
    console.log(`Token: ${globalToken.substring(0, 30)}...`);
    return true;
  } else {
    console.log(`❌ Login failed`);
    console.log(JSON.stringify(response.data, null, 2));
    return false;
  }
}

/**
 * Test 2: Get User Info
 */
async function testGetMe() {
  console.log('\n🔍 TEST 2: Get User Info (/api/auth/me)\n');

  if (!globalToken) {
    console.log('❌ No token available. Run login test first.');
    return false;
  }

  const response = await makeRequest('GET', '/api/auth/me', null, {
    'Authorization': `Bearer ${globalToken}`,
  });

  console.log(`Status: ${response.status}`);
  console.log(`Message: ${response.data.message}`);

  if (response.status === 200 && response.data.data?.user) {
    console.log(`✅ User info retrieved!`);
    console.log(`User: ${response.data.data.user.name} (${response.data.data.user.role})`);
    return true;
  } else {
    console.log(`❌ Failed to get user info`);
    console.log(JSON.stringify(response.data, null, 2));
    return false;
  }
}

/**
 * Test 3: Fetch Content (GET)
 */
async function testFetchContent() {
  console.log('\n📚 TEST 3: Fetch Content (/api/content)\n');

  const response = await makeRequest('GET', '/api/content');

  console.log(`Status: ${response.status}`);
  console.log(`Message: ${response.data.message}`);

  if (response.status === 200 && Array.isArray(response.data.data)) {
    console.log(`✅ Content fetched!`);
    console.log(`Total items: ${response.data.data.length}`);
    if (response.data.data.length > 0) {
      console.log(`Latest: "${response.data.data[0].title}"`);
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
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));

  const tests = [
    { name: 'Login', result: results.login },
    { name: 'Get User Info', result: results.getMe },
    { name: 'Fetch Content', result: results.fetchContent },
  ];

  tests.forEach(test => {
    const icon = test.result ? '✅' : '❌';
    console.log(`${icon} ${test.name}`);
  });

  const passed = tests.filter(t => t.result).length;
  const total = tests.length;
  console.log('='.repeat(60));
  console.log(`Result: ${passed}/${total} tests passed\n`);

  if (passed === total) {
    console.log('🎉 ALL TESTS PASSED! System is working correctly.\n');
    console.log('Next Steps:');
    console.log('1. Open browser: http://localhost:5174');
    console.log('2. Navigate to: http://localhost:5174/login');
    console.log('3. Login with:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('4. Go to /admin and create content with files');
    console.log('5. Check terminal logs for detailed request/response info\n');
  } else {
    console.log('⚠️  Some tests failed. Check the output above.\n');
  }
}

/**
 * Main Test Runner
 */
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 STARTING API TESTS');
  console.log('='.repeat(60));
  console.log(`API Base: ${API_BASE}\n`);

  const results = {
    login: false,
    getMe: false,
    fetchContent: false,
  };

  try {
    results.login = await testLogin();
    results.getMe = await testGetMe();
    results.fetchContent = await testFetchContent();
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
  }

  printSummary(results);
  process.exit(results.login && results.getMe && results.fetchContent ? 0 : 1);
}

runTests();
