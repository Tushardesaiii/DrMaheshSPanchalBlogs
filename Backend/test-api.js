import fetch from 'node-fetch';

const API_BASE = 'http://localhost:8000';

async function testLogin() {
  try {
    console.log('Testing login endpoint...\n');
    
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@main123',
        password: 'Admin12345',
      }),
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.data?.accessToken) {
      console.log('\n✅ Login successful! Token:', data.data.accessToken.substring(0, 20) + '...');
    } else {
      console.log('\n❌ No token in response');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();
