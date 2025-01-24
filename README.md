# PayMe
PayMe is a web application that allows users to manage their subscriptions and transactions seamlessly. 

## Server-Side Features
- Integration with Stripe for payment processing
- RESTful API for handling user authentication and subscriptions
- Secure user authentication mechanism using JWT token for reliable login.
- MongoDB integration to efficiently access, store and manage user transaction records

## Client-Side Features
- User authentication (sign in and sign up)
- Subscription management
- Transaction history
- Responsive design

## Tech Stack
- `Frontend`: React, Vite, Axios, Stripe
- `Backend`: Node.js, Express, MongoDB, Stripe, JWT, bcryptjs

## Installation Instructions

### Client
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Server
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Usage
- The client application can be accessed at `http://localhost:3000`.
- The server API is available at `http://localhost:5000`.

To test, use customer details:
- email: firstCustomer@example.com
- address: Next to Shop, 
         Hyderabad, TG, India
         502285

use card details as:
- Card Holder name: First Customer
- Card number - 4242 4242 4242 4242
- Date - 12/34
- CVC - Any three-digit number

## API 
### User Endpoints
- `POST /api/auth/signup`: Create a new user.
- `POST /api/auth/signin`: Authenticate a user.
- `POST /api/auth/signout`: Log out a user.
- `POST /api/auth/refreshToken`: Refresh the authentication token.
- `GET /api/auth/allUser`: Retrieve all users (admin only).

### Subscription Endpoints
- `GET /api/subscriptions/allSubscriptions`: Retrieve all subscriptions.
- `POST /api/subscriptions/create`: Create a new subscription (admin only).
- `PATCH /api/subscriptions/:subscriptionId`: Update an existing subscription by ID (admin only).
- `DELETE /api/subscriptions/:subscriptionId`: Delete a subscription by ID (admin only).

### Transaction Endpoints
- `POST /api/transactions/create`: Create a new transaction.
- `PATCH /api/transactions/:transactionId`: Update an existing transaction by ID.
- `DELETE /api/transactions/:transactionId`: Delete a transaction by ID.
- `GET /api/transactions/:userId`: Retrieve transactions for a specific user (admin only).
