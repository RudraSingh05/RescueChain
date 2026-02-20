✅ AUTH SERVICE – TEST CASE DOCUMENT
Project: Microservices Backend
Service: Auth Service
Environment: Local (http://localhost:5000)
API Base: /auth
1️⃣ REGISTER ENDPOINT
Endpoint:
POST /auth/register
TC-AUTH-001
Title: Register user successfully
Type: Positive
Request Body:
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
Expected Result:
Status Code: 201
Response contains:
message: "User registered"
user object
Password field NOT present in response
User stored in database
TC-AUTH-002
Title: Register with duplicate email
Type: Negative
Use same email again.
Expected Result:
Status Code: 409
Response:
{
  "error": "Email already exists"
}
TC-AUTH-003
Title: Register with invalid email
Type: Validation
{
  "name": "John",
  "email": "invalid",
  "password": "password123",
  "role": "USER"
}
Expected:
Status Code: 400
Validation error from Zod
TC-AUTH-004
Title: Register with short password
Password < 6 chars
Expected:
Status: 400
Validation error
TC-AUTH-005
Title: Register with invalid role
Role = "SUPERADMIN"
Expected:
Status: 400
Validation error
2️⃣ LOGIN ENDPOINT
Endpoint:
POST /auth/login
TC-AUTH-006
Title: Login successfully
Type: Positive
Valid email + password
Expected:
Status: 200
Response contains JWT token
Token expires in 15 minutes
TC-AUTH-007
Title: Login with wrong password
Expected:
Status: 401
Message: "Invalid credentials"
TC-AUTH-008
Title: Login with non-existing email
Expected:
Status: 401
Message: "Invalid credentials"
TC-AUTH-009
Title: Login rate limit test
Call login > 20 times within 15 minutes.
Expected:
Status: 429
Message: Too many requests
3️⃣ AUTHENTICATION MIDDLEWARE
Endpoint:
GET /auth/me
Requires Header:
Authorization: Bearer <token>
TC-AUTH-010
Title: Access protected route with valid token
Expected:
Status: 200
Returns decoded user data
TC-AUTH-011
Title: Access without token
Expected:
Status: 401
Error: No token
TC-AUTH-012
Title: Access with invalid token
Expected:
Status: 401
Error: Invalid token
TC-AUTH-013
Title: Access with expired token
Wait 15 min OR modify expiration temporarily.
Expected:
Status: 401
Error: Invalid token
4️⃣ AUTHORIZATION (Role-Based Access)
Endpoint:
GET /auth/admin
TC-AUTH-014
Title: Admin accesses admin route
Login as ADMIN
Expected:
Status: 200
Message: "Admin access granted"
TC-AUTH-015
Title: USER accesses admin route
Login as USER
Expected:
Status: 403
Error: Forbidden
5️⃣ SECURITY TESTS
TC-AUTH-016
Title: Check password hashing
Go to DB manually.
Expected:
Password stored as hash
Not plain text
TC-AUTH-017
Title: Check security headers
Inspect response headers.
Expected:
X-DNS-Prefetch-Control
X-Frame-Options
X-Content-Type-Options
etc (from Helmet)
6️⃣ ERROR HANDLING
TC-AUTH-018
Title: Force server error
Temporarily break DB connection.
Expected:
Status: 500
Response:
{
  "message": "Internal Server Error"
}