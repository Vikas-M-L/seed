const https = require('https');

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

const req = require('http').request(options, (res) => {
    let body = '';

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', body);

        if (res.statusCode === 201) {
            const response = JSON.parse(body);
            console.log('\n✅ Login successful!');
            console.log('User:', response.user.full_name);
            console.log('Role:', response.user.roles[0]);
            console.log('Token received:', response.access_token ? 'Yes' : 'No');
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error.message);
});

req.write(data);
req.end();
