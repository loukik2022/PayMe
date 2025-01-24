import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import connectDB from "./config/db.js";

import stripeRoutes from "./routes/stripeRoute.js"
// import stripeService from "./stripeService.js"
import userRoutes from "./routes/userRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import subscriptionRoutes from './routes/subscriptionRoutes.js'

dotenv.config()

const app = express()

// middlewares
app.use((req, res, next) => {   // Conditional middleware to skip parsing for specific routes
    if (req.originalUrl === "/stripe/webhook") next(); 
    else express.json()(req, res, next); 
});
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:5173",    //  process.env.CORS_ORIGIN
    credentials: true       // allow cross-origin credentials stored in cookies (JWT authentication)
}))
app.use(cookieParser())     // perform crud on cookies data (from client)

app.get('/auth/stripe', (req, res) => {
    const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.STRIPE_CLIENT_ID}&scope=read_write`;
    res.redirect(stripeAuthUrl);
});

app.get('/auth/stripe/callback', async (req, res) => {
    const { code } = req.query;

    // Exchange the code for an access token
    const response = await axios.post('https://connect.stripe.com/oauth/token', {
        client_secret: process.env.STRIPE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code'
    });

    const { access_token } = response.data;

    // Store the access token as needed
    // For example, you might want to save it in a database or a session
    res.cookie('accessToken', access_token, { httpOnly: true });
    res.redirect('/'); // Redirect to your app's main page
});

// routes
app.use('/stripe', stripeRoutes)
app.use('/api/users', userRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/subscriptions', subscriptionRoutes)

// connect to MongoDB (local)
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at @ http://localhost:${process.env.PORT}/api/users/signup`);
        })
    })
    .catch((err) => {
        console.log("MONGO DB connection failed !!! ", err);
    })
