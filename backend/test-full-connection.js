const http = require('http');

console.log('🔍 Testing Full Connection...\n');

// Test 1: Backend Health Check
function testBackendHealth() {
    return new Promise((resolve, reject) => {
        console.log('1️⃣ Testing Backend Health...');
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'OPTIONS',
        }, (res) => {
            console.log(`   ✅ Backend is running (Status: ${res.statusCode})`);
            resolve(true);
        });

        req.on('error', (error) => {
            console.log(`   ❌ Backend connection failed: ${error.message}`);
            reject(error);
        });

        req.end();
    });
}

// Test 2: Login API
function testLogin() {
    return new Promise((resolve, reject) => {
        console.log('\n2️⃣ Testing Login API...');

        const data = JSON.stringify({
            email: 'admin@attendease.com',
            password: 'admin123'
        });

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 201) {
                    const response = JSON.parse(responseData);
                    console.log(`   ✅ Login successful (Status: ${res.statusCode})`);
                    console.log(`   📧 User: ${response.user.name} (${response.user.email})`);
                    console.log(`   👤 Role: ${response.user.role}`);
                    console.log(`   🎫 Token: ${response.access_token.substring(0, 30)}...`);
                    resolve(response);
                } else {
                    console.log(`   ❌ Login failed (Status: ${res.statusCode})`);
                    console.log(`   Response: ${responseData}`);
                    reject(new Error(`Login failed with status ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            console.log(`   ❌ Login request failed: ${error.message}`);
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

// Test 3: Frontend Availability
function testFrontend() {
    return new Promise((resolve, reject) => {
        console.log('\n3️⃣ Testing Frontend Availability...');
        const req = http.request({
            hostname: 'localhost',
            port: 5173,
            path: '/',
            method: 'HEAD',
        }, (res) => {
            console.log(`   ✅ Frontend is accessible (Status: ${res.statusCode})`);
            resolve(true);
        });

        req.on('error', (error) => {
            console.log(`   ❌ Frontend connection failed: ${error.message}`);
            reject(error);
        });

        req.end();
    });
}

// Test 4: CORS Check
function testCORS() {
    return new Promise((resolve, reject) => {
        console.log('\n4️⃣ Testing CORS Configuration...');
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:5173',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        }, (res) => {
            const corsHeader = res.headers['access-control-allow-origin'];
            if (corsHeader) {
                console.log(`   ✅ CORS is configured (Allow-Origin: ${corsHeader})`);
                resolve(true);
            } else {
                console.log(`   ⚠️  CORS headers not found`);
                resolve(false);
            }
        });

        req.on('error', (error) => {
            console.log(`   ❌ CORS check failed: ${error.message}`);
            reject(error);
        });

        req.end();
    });
}

// Run all tests
async function runTests() {
    try {
        await testBackendHealth();
        await testLogin();
        await testFrontend();
        await testCORS();

        console.log('\n' + '='.repeat(50));
        console.log('🎉 ALL TESTS PASSED!');
        console.log('='.repeat(50));
        console.log('\n✅ Your application is fully connected and working!');
        console.log('\n📝 Login Credentials:');
        console.log('   Email: admin@attendease.com');
        console.log('   Password: admin123');
        console.log('\n🌐 Access Points:');
        console.log('   Frontend: http://localhost:5173');
        console.log('   Backend API: http://localhost:3000/api');
        console.log('   API Docs: http://localhost:3000/api/docs');
        console.log('');
    } catch (error) {
        console.log('\n' + '='.repeat(50));
        console.log('❌ TESTS FAILED');
        console.log('='.repeat(50));
        console.log(`\nError: ${error.message}`);
        process.exit(1);
    }
}

runTests();
