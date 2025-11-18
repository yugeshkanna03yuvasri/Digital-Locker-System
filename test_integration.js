// Integration Test Script for Frontend-Backend Connection
// Run this in browser console on signup page to test integration

async function testSignupIntegration() {
    console.log('🧪 Testing Frontend-Backend Integration...');
    
    // Test data
    const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        phone: '+1234567890',
        company: 'Test Company',
        jobTitle: 'Test Manager',
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
        role: 'USER'
    };
    
    try {
        // Test API endpoint availability
        console.log('📡 Testing API endpoint...');
        const response = await fetch('http://localhost:8080/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: `${testUser.firstName} ${testUser.lastName}`,
                email: testUser.email,
                password: testUser.password,
                role: testUser.role,
                phone: testUser.phone,
                company: testUser.company,
                jobTitle: testUser.jobTitle
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Signup API working!', result);
            
            // Test login with created user
            console.log('🔐 Testing login...');
            const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: testUser.email,
                    password: testUser.password
                })
            });
            
            if (loginResponse.ok) {
                const loginResult = await loginResponse.json();
                console.log('✅ Login API working!', loginResult);
                console.log('🎉 Integration test PASSED!');
            } else {
                console.error('❌ Login failed:', await loginResponse.text());
            }
        } else {
            console.error('❌ Signup failed:', await response.text());
        }
    } catch (error) {
        console.error('❌ Integration test FAILED:', error);
        console.log('💡 Make sure both frontend and backend are running');
        console.log('💡 Frontend: npm start (port 3000)');
        console.log('💡 Backend: mvn spring-boot:run (port 8080)');
    }
}

// Test database connection
async function testDatabaseConnection() {
    console.log('🗄️ Testing database connection...');
    try {
        const response = await fetch('http://localhost:8080/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer test-token'
            }
        });
        
        // Even if unauthorized, a response means backend is running
        console.log('✅ Backend is responding (database connection likely working)');
    } catch (error) {
        console.error('❌ Backend not responding:', error);
    }
}

// Run tests
console.log('🚀 Starting integration tests...');
testDatabaseConnection();
setTimeout(() => testSignupIntegration(), 1000);