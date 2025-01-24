### 1. Project Setup: Done

### 2. Backend Development
- Database Setup: #Done
  1. Configure MongoDB connection in `src/config/db.js`.
  2. Test the connection using a dummy endpoint.

- Models: #Done
  1. Define `User`, `Subscrition`,  and `Transaction` models Schema.
  2. Test above by insertion - deletion

Design Q: whether to store transaction id of a particular user in user schema too?
If want to retrieve all transactions for a user, can query the transaction collection using the userID. 
MongoDB's indexing makes this query efficient without needing to store a list of transaction IDs in the user document.

Problem: Incorrect db connection string (pass db name two times, one in env and one in index.js)
Solution: Remove the db name from the index.js file and use only the env variable for db connection

- Authentication & Authorization: #Done
Source: https://www.bezkoder.com/node-js-mongodb-auth-jwt/
  1. Create routes and logic for user registration and login.
  2. Use jwt token for user authorization
  3. Implement `authMiddleware` to check user roles.
  4. Add error-handling middleware.

local-storage vs session-storage vs cookie:
- localStorage for persistent data across sessions.
- sessionStorage for temporary data within a single session.
- cookies for session management and data that needs to be sent to the server automatically

Middlewares:
To verify a Signup action, we need 2 functions:
– check duplications for username and email
– check if roles in the request is legal or not

To process Authentication & Authorization, we create following functions:
- check if token is provided, legal or not. 
    Extract token from x-access-token of HTTP headers, 
    then use jsonwebtoken's verify() function
- check if roles of the user contains required role or not

Controllers:
User Registration Controller: (sign-up)
1. Receive User Data: Extract user data (e.g., username, password) from the request body.
2. Hash Password: Use `bcryptjs` to hash the user’s password.
3. Save User: Save the new user to the database with the hashed password.
4. Respond: Send a response indicating successful registration.

User Login Controller: (sign-in)
1. Receive Credentials: Extract username and password from the request body.
2. Find User: Look up the user in the database by username.
3. Verify Password: Use `bcryptjs` to compare the provided password with the stored hashed password.
4. Generate JWT: If the password is correct, generate a JWT using `jsonwebtoken`.
5. Respond: Send the JWT and user information in the response.

Token Refresh Controller:
1. Receive Refresh Token: Extract the refresh token from the request body.
2. Verify Refresh Token: Use `jsonwebtoken` to verify the refresh token.
3. Generate New Access Token: If the refresh token is valid, generate a new access token.
4. Respond: Send the new access token in the response.


Routes:

Methods	         Urls	                        Actions
-------------------------------------------------------------------
POST	      /api/user/signup	        signup new account
POST	      /api/user/signin	        sign-in existing account
POST	      /api/user/refreshToken    verify and return new token
GET	      /api/user/allUser	        retrieve all User’s account 

Problem: Forgot to generate refresh token in the sign-in process. 
         This will cause user to log out after 1 hour (default expiration time of JWT token).
         So need to sign in again using credentials

Problem: Admin role was saved as user (default) in db in auth middleware
         This will cause admin to be treated as user and no extra permissions

Test using Postman for different routes


- Transactions logic and save in db:
  1. Add transaction management logic 
  2. Implement CRUD operations for transaction history


Set Up Stripe # DONE
   - Install Stripe Node.js library: `npm install stripe`
   - Configure Stripe with your secret key.

Transaction Controller Functions
   - Create Transaction -> A user purchases a subscription.
   - Update Transaction -> Updating the status of a transaction (from pending to success or failed).
   - Delete Transaction -> Removing a transaction record (in case of a error)
   - Get User Transaction (admin) -> Retrieving transaction details for a user. 

FUNCTION createTransaction(req, res)
    EXTRACT data FROM req.body
    IF data IS VALID
        CREATE transaction
        SAVE transaction
        RETURN success response
    ELSE
        RETURN error response

FUNCTION updateTransaction(req, res)
    EXTRACT transactionId FROM req.params
    EXTRACT updates FROM req.body
    FIND transaction BY transactionId
    IF transaction EXISTS
        UPDATE transaction WITH updates
        SAVE transaction
        RETURN success response
    ELSE
        RETURN error response

FUNCTION deleteTransaction(req, res)
    EXTRACT transactionId FROM req.params
    FIND and DELETE transaction BY transactionId
    IF transaction EXISTS
        RETURN success response
    ELSE
        RETURN error response

FUNCTION getUserTransaction(req, res)
    EXTRACT userId FROM req.params
    FIND transactions BY userId
    IF transactions FOUND
        RETURN transactions
    ELSE
        RETURN error response

Transaction Routes
| Methods   | Urls                       | Actions                  |
| --------- | -------------------------- | ------------------------ |
| POST      | /api/transactions          | Create Transaction       |
| GET       | /api/transactions/:userId  | Get Transaction by User  |
| PATCH     | /api/transactions/:id      | Update Transaction       |
| DELETE    | /api/transactions/:id      | Delete Transaction       |

Integrate Middleware
   - Use middleware for authentication and authorization.
   - Implement validation middleware for request data.

Test the Endpoints
   - Use Postman to test each endpoint.
   - Verify CRUD operations and handle edge cases.

Problems: validation middleware contains function that check for all missing field,
          but patch does not need all fileds in its request
Soltuin: spilt validation middleware, one for create, one for update, one for delete and use seperately


- API Integration: #Done
  1. Test backend endpoints with Postman.

- Plan Management: #DONE
  1. Implement CRUD operations for SaaS plans (`src/controllers/planController.js` and `src/routes/planRoutes.js`).


- Stripe Webhook: #Done

Stripe CLI Login:
account id: acct_1OCIWZSBvryMQKIB

./stripe login --interactive  
(Enter API key)

./stripe listen --forward-to http://localhost:8000/stripe/webhook    (difficulty: wrong url - client used prev)


difficulty: now when user login, a user id is created (or existing user id) is used. but when payment is done using stripe, a customer id (from invoice) is created by stripe invoice which is different from user id. But to simplify the logic and want both to same which is not possible. do not code. tell me widely use strategies to solve this
-> Maintain a mapping table in your database to link your internal id with Stripe's id. 
-> Stripe IDs (customerId, invoiceId, and productId) <-> (userId, transactionId, and subscriptionId):

challenge: how to send the userid and subscriptionid from client to backend (stripe) for payment (checkout)
solution: use cookies, store details in backend and send it to client.
now the browser (client) can send back the cookie to the backend in every request

- responsibility of the backend to set cookies in the response before sending it to the client.
- cookies expire when the user closes the session, that is, when she closes the browser
- cookies are scopes to path and domain (cannot be accessed from any path using any domain, set CORS properly)
response.headers["Set-Cookie"] = "myfirstcookie=somecookievalue"
lookup in console using: document.cookie

[IMP] -> do not forgot to set CORS properly in backend (backend->client)
      -> do not forgot to send axios with credentials: true (in client)

### 3. Frontend Development
- Routing:  #Done (AdminPage Later)
  1. Set up React Router for navigation between pages (`LandingPage`, `LoginPage`, `AdminPage`, etc.).

- Authentication: 
  1. Build registration and login forms (`src/components/auth/`). #Done
  2. Manage user sessions using `AuthContext`.

- Plan Display:      #Done
  1. Create components to display plans (`PlanList` and `PlanDetails`).
  2. Fetch plan data from the backend using `planApi`.

   Client-Side:
   - Collect Payment Information: Gather payment details from the user.
   - Create Payment Intent: Communicate with the server to create a payment intent.
   - Handle Payment Confirmation: Confirm the payment on the client side using Stripe’s SDK.

   Server-Side:
   - Create Payment Intent: Create a payment intent using Stripe’s API.
   - Handle Webhooks: Listen for events from Stripe to update transaction status.
   - Store Transaction Details: Save transaction details in the database

- Cart and Checkout: 
  1. Implement cart functionality with `CartContext` and `Cart` component.
  2. Integrate Stripe checkout in `CheckoutPage`.

- Dashboards:  
  1. Build `SuperAdminDashboard` and `AdminDashboard` components.
  2. Implement logic for managing users and plans.

- Styling:
  1. Create global styles (`styles.css`) and add responsive design.

### 4. Stripe Integration
- Backend:
  1. Configure Stripe API in `src/config/stripe.js`.
  2. Add webhook handlers in `stripeService.js` for payment success and failure.

- Frontend:
  1. Set up Stripe checkout form in `CheckoutPage`.
  2. Test with Stripe's test card details.

### 5. Testing and Debugging
- Backend:
  1. Write unit tests for controllers and services.
  2. Use tools like Postman or Insomnia to test API endpoints.

- Frontend:
  1. Test all user flows: registration, login, plan selection, cart management, checkout, and dashboards.
  2. Debug and fix layout or logic issues.

### 6. Deployment
- Backend:
  1. Deploy to a cloud service (e.g., AWS, Heroku).
  2. Use environment variables for sensitive information.

- Frontend:
  1. Deploy using services like Netlify or Vercel.
  2. Update API base URLs for production.

- Database:
  1. Use MongoDB Atlas for hosting the database.

### 7. Final QA and Documentation
- Perform end-to-end testing in the production environment.
- Document API endpoints, project structure, and setup instructions in `README.md`.

-----------------------------------------------------------------------------------------------------

### Design Decision Questions for the Project  

### Backend Design Decisions
1. Database Structure:   MongoDB
   - How should the schema be designed for SaaS plans, users, and orders to support scalability and flexibility?
   - Should relationships between entities (e.g., users and orders) be embedded or referenced in MongoDB? 

MongoDB
- no normalization as in RDBMS
- flexible schema design (no tabular schema), can implement
- collection of documents, document based (and add-remove new field whenever we want in document)
- highly efficient in crud operations
- moongose (node implementation) to interact (via api) with MongoDB (server)

decide fields in schema

WHY MongoDB?
Dynamic Data Handling: 
   Payment gateway responses from Stripe often contain dynamic metadata (e.g., webhook payloads). 
   MongoDB's schema-less nature allows for easy storage and querying of such data without strict constraints.
   
Integration with JWT Sessions


2. Authorization
   - Should session-based authorization, or would JWT-based authorizationter scalability?   JWT + store user-admin role in MongoDB
   - How should middleware be implemented to differentiate between Super Admin, Admin, and User roles?  JWT Middleware with different routes
   - What specific permissions should each role have?
        1.  Admin:
        Key Responsibilities: Oversee the SaaS system, manage plans, and monitor organizations.
        Permissions:
            Add, edit, delete SaaS plans.
            Assign roles to user
            Manage the organization’s current plan and billing history.
            Monitor usage metrics for organizations and users.

        3. User:
        Key Responsibilities: Utilize the application’s services under their assigned role.
        Permissions:
            Access the purchased SaaS plan features.
            View their account information and activity logs.
            View their organization’s current plan but without edit rights.

   - How will password hashing and user roles be implemented securely? #TODO

4. Error Handling:  
   - What strategy should be used for centralized error handling in the backend?  Centralized error middlewares
   - How should validation errors and payment errors be surfaced to the frontend?  inline error messages

3. Stripe Integration:  #TODO
   - Should Stripe events be handled synchronously or via webhooks?  Webhooks: HTTPS + signing the message
   - How will failed or incomplete payments be managed in the system?
     Situation: Due to power failuer, or client connection lost during transaction: 
        payment is cancelled on Stripe’s end due to the interruption
        but how it should be reflected to client ->

        - synchronous: manually user cancels the transaction when they noticed the payment failed
        - asynchronous: 
            Webhook Triggered: Stripe sends a webhook event to server indicating  payment cancellation.
            Server Updates Status: Server processes the webhook, updates the transaction status in the database, and optionally sends a notification to the client.
   
   - What if attackers send the stripe msg to our server ? Verify using hash of Stripe’s signature and secret key (client unreliable)

5. API Structure:  
   - Should REST APIs be used, or would a GraphQL API be more appropriate for this use case?  REST API for now (#TODO GraphQL)
   - How will API versioning be handled to support future updates? #TODO

7. Scalability:  #TODO
   - Should microservices be used to handle different domains (e.g., payments, plans, user management), or is a monolithic backend sufficient initially?  
   - What caching mechanism (e.g., Redis) should be employed for frequent queries?

---

### Frontend Design Decisions
1. Component Structure:  
   - How should components be modularized to balance reusability and separation of concerns?  
   - Should state management be handled via Context API or a library like Redux?

2. Routing and Navigation:  
   - Should user roles dictate the routing structure (e.g., separate dashboards for Super Admin and Admin)?  
   - How should unauthenticated users be redirected to the login page?

3. Payment UI:  
   - Should the Stripe Checkout UI be embedded in the app, or should users be redirected to Stripe’s hosted checkout page?  
   - How will real-time feedback (e.g., loading states, errors) be provided during the payment process?

4. Plan and Cart Display:  
   - What is the best way to structure the data flow for browsing plans and managing the cart?  
   - Should data be fetched once on the dashboard load or cached locally to reduce API calls?

5. User Experience:  
   - How should error messages be presented to users (e.g., toast notifications vs. inline feedback)?  
   - What responsive design framework (e.g., Tailwind CSS, Material UI) should be used?

---

### Stripe Integration Design Decisions
1. Webhooks and Payment Flow:  
   - How will the system handle webhook retries in case of transient failures?  
   - Should payments be marked as pending until confirmed by Stripe, or assume success immediately after checkout?

2. Test and Live Mode Separation:  
   - How will test and production Stripe environments be managed (e.g., separate keys, environments)?  
   - What safeguards will prevent accidental use of production keys during development?

---

### General Design Decisions
1. Deployment:  
   - What hosting platforms will be used for backend (e.g., AWS, Heroku) and frontend (e.g., Vercel, Netlify)?  
   - How will CI/CD pipelines be set up for smooth deployments?

2. Logging and Monitoring:  
   - What logging tools (e.g., Winston, Morgan) will be used in the backend?  
   - How will application performance and Stripe-related events be monitored?

3. Scalability and Maintainability:  
   - What naming conventions and folder structures will best support long-term maintainability?  
   - Should a centralized configuration management tool be adopted for environment variables?

4. Testing:  
   - What types of tests (e.g., unit tests, integration tests) will be prioritized?  
   - What testing tools (e.g., Jest, Postman) will be used for backend and frontend?  

5. Documentation:  
   - Should the API documentation be autogenerated (e.g., using Swagger)?  
   - How will usage guidelines for admins and users be documented and maintained?  

These questions can guide discussions with stakeholders and help align the design choices with the project requirements and constraints.

-----------------------------------------------------------------------------------------------------

### Key Concepts and Definitions

Authentication: Refers to verify who you are, (e.g., via login and password).  
Authorization: Refers to what you can do (e.g., permissions).  

Cookie:
  - A `name=value` pair stored in a web browser.
  - Associated with a domain and may have an expiry date.
  - Automatically sent by the client to the server with HTTP requests.

A cookie is a small piece of data stored in the user's browser, often used to track sessions, authenticate users, or store preferences.
In Express:
Backend sets cookies on the client’s browser.
Client sends these cookies back to the server with every request.

Token:
  - Json object with 3 componetns: header, payload, and signature, added by client to request 
  - Stored by client in browser as token (single sign-on) in cookie
  - No expiry date or associated domain.
  - Must be manually added to headers by the client.

JWT (JSON Web Token):
  - A token containing encoded (not encrypted) payload data, signed by the server.
  - Can include information like user ID for stateless authentication.


Refresh token: 
- used to obtain a new access token when the current one expires (no need to enter credentials again)
1. Initial Authentication: When a user sign-in, the authorization server issues both an access token and a refresh token.
2. Access Token Usage: The access token is used to access protected resources. It has a short lifespan for security reasons.
3. Token Expiry: If access token expires, the client can use the refresh token to request a new access token from server.
4. New Access Token: The authorization server verifies the refresh token and, if valid, issues a new access token.
---

Where and Why to Use JWT

- Useful in RESTful APIs:
  - When the server should remain stateless (no session storage).

- Difference from Sessions:
  - Sessions: Server stores session data and matches it with a token from the client (cookie).
  - JWT: Data is included in the token itself; the server only decodes the token.

---

JWT Authentication Flow:
1. User sends credentials to login.
2. Server creates a JWT returns a JWT signed with a key.
3. Client stores JWT (e.g., in `localStorage` in cookie).
4. JWT is sent in the `Authorization` header with each API request.
5. Server verifies the JWT, extracts user details and send response to client.

SSO (single sign-on):
Once a client has a JWT token, it is included in the Authorization header of each HTTP request. 
Server verify the token and authenticate the user without requiring them to log in again with their credentials.
---

Best Practices:

- Use short expiry times for JWTs and refresh tokens for re-authentication.
- Avoid storing JWTs in `localStorage` if the application is vulnerable to XSS attacks; consider `httpOnly` cookies instead.
- Validate and sanitize all payloads and verify tokens with the server’s secret key.

---

Use Cases:

1. When to Use Authentication:
   - Any scenario where verifying the user's identity is required (e.g., logging in).

2. When to Use Authorization:
   - When determining a user's permissions or access level (e.g., admin vs regular user).

3. When to Use JWT-Based Authentication:
   - Stateless systems where maintaining server-side session data is undesirable (e.g., RESTful APIs).
   - Mobile and SPA (Single Page Applications) where the token is sent with each request.

4. When to Use Session-Based Authentication:
   - Stateful systems where user sessions are managed server-side.
   - Traditional web applications relying on cookies for session tracking.

5. Stateful vs Stateless Use Cases:
   - Stateful (Session-Based): Requires server-side storage of session data, suitable for applications with frequent server interactions and sensitive data management.
   - Stateless (JWT-Based): No server-side state, better for scalability and distributed systems.

---

Practical Use Cases: Stateful vs Stateless

1. Stateful Systems (Session-Based):
   - E-commerce Platforms: Online shopping systems like Amazon use session-based authentication to securely manage user carts and preferences across multiple page visits.
   - Banking Applications: State is required to ensure secure and consistent transactions, such as tracking session timeouts and preventing unauthorized access.

2. Stateless Systems (JWT-Based):
   - Microservices Architecture: Companies like Netflix use JWTs to authenticate and authorize requests between microservices without maintaining centralized state.
   - Mobile Applications: Apps like WhatsApp or Slack rely on JWTs for lightweight and scalable authentication across distributed servers.
   - Content Delivery Networks (CDNs): Stateless JWTs ensure secure and efficient access to resources (e.g., videos or images) without server-side session tracking.

Security Considerations:

1. Encoding vs Encryption:
  - JWT payload is encoded, not encrypted, so anyone with access can read the data if they know the secret.

2. Secure Transmission:
  - Always use encrypted connections (SSL/TLS) to prevent attackers from stealing the JWT during transmission.

--- 

Encryption
Definition: Converts readable data (plaintext) into an unreadable format (ciphertext) using algorithms and keys.
Reversibility: Requires a decryption key to revert ciphertext back to plaintext.
Use Cases: Ideal for data that needs to be accessed and processed in its original form.
Types:
   Symmetric Encryption: Same key for encryption and decryption.
   Asymmetric Encryption: Different keys for encryption (public key) and decryption (private key).
Security: Protects data during transmission and storage but can be vulnerable if keys are compromised.

Tokenization
Definition: Replaces sensitive data with non-sensitive tokens that have no exploitable value.
Reversibility: Tokens can only be mapped back to the original data via a secure tokenization system.
Use Cases: Suitable for data that rarely needs to be accessed in its original form, such as credit card numbers.
Types:
   Traditional Tokenization: Uses a centralized token vault to store the mapping between tokens and original data.
   Vaultless Tokenization: Generates tokens without storing the original data in a central location.
Security: Reduces the risk of data breaches as tokens are meaningless outside the tokenization system.

-----------------------------------------------------------------------------------------------------

### Authentication and Authorization with JWT: A Step-by-Step Guide

#### 1. Understanding JWT
JWT (JSON Web Token) is a compact, self-contained way of transmitting information between parties as a JSON object. It is used for:
- Authentication: Verifying the identity of a user.
- Authorization: Controlling access to resources.

A JWT consists of three parts:
- Header: Specifies the algorithm used (e.g., `HS256`) and the token type (`JWT`).
- Payload: Contains claims, which are statements about the user (e.g., user ID, roles).
- Signature: Ensures the token hasn’t been tampered with.


#### Authentication:
1. User Registration:
   - Accept user details (e.g., username, email, password).
   - Hash the password and save user data to the database.

2. User Login:
   - Verify credentials (email and password) against the database.
   - If valid, generate a JWT containing user-specific claims (e.g., user ID, roles).
   - Send the JWT to the client.

3. Store JWT on Client:
   - Store the token securely (e.g., HTTP-only cookies or local storage).

---

#### Authorization:
1. Client Request:
   - Include the JWT in the `Authorization` header or as a cookie for each request.

2. Token Verification:
   - Validate the token's signature, expiration, and claims on the server.
   - Decode the payload to access user-specific data.

3. Role/Permission Check:
   - Use claims (e.g., roles or permissions) from the JWT to enforce access control.

---

#### Security Best Practices:
1. Use strong secrets for signing tokens.
2. Set token expiration times and use refresh tokens for re-authentication.
3. Always transmit tokens over HTTPS.
4. Validate tokens on every request to protected resources.
5. Implement logout by invalidating tokens (e.g., token blacklist).