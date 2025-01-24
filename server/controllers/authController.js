import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.js";

/*
User Registration: (sign-up)
1. Receive User Data: Extract user data (e.g., username, password) from the request body.
2. Hash Password: Use `bcryptjs` to hash the user’s password.
3. Save User: Save the new user to the database with the hashed password.
4. Respond: Send a response indicating successful registration.

User Login: (sign-in)
1. Receive Credentials: Extract username and password from the request body.
2. Find User: Look up the user in the database by username.
3. Verify Password: Use `bcryptjs` to compare the provided password with the stored hashed password.
4. Generate JWT: If the password is correct, generate a JWT using `jsonwebtoken`.
5. Respond: Send the JWT and user information in the response.

User Logout: (sign-out)
1. Receive Refresh Token: Extract the refresh token from the request body.
2. Find User: Look up the user in the database by refresh token.
3. Invalidate Refresh Token: If the refresh token is valid, invalidate it.
4. Respond: Send a response indicating successful logout.

Token Refresh:
1. Receive Refresh Token: Extract the refresh token from the request body.
2. Verify Refresh Token: Use `jsonwebtoken` to verify the refresh token.
3. Generate New Access Token: If the refresh token is valid, generate a new access token.
4. Respond: Send the new access token in the response.
*/

const signup = async (req, res) => {
    let { username, email, password, role } = req.body;

    // Check if user is already registered
    const existingUser = await User.findOne({ $or: [{ username }, { email }] }).exec();
    if (existingUser) {
        return res.status(400).send({ message: "User already exists!" });
    }

    try {
        // Hash Password
        const hashedPassword = bcrypt.hashSync(password, 8);

        if (!role) role = 'user';     // Default role

        // Create a new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role
        });

        // Save user to the database
        await user.save();

        res.status(201).send({ message: "User was registered successfully!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find User
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        // Verify Password
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        // Generate Access Token
        const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        // Generate Refresh Token
        const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: 864000 // 10 days
        });

        // Save Refresh Token to the database
        user.refreshToken = refreshToken;
        await user.save();

        // Set cookie with user ID or token
        res.cookie('accessToken', accessToken, {
            maxAge: 3600000,    // 1 hour
        });
        res.cookie('refreshToken', refreshToken, {
            maxAge: 24 * 3600000, // 24 hour
        });

        // Respond with user information and tokens
        res.status(200).send({
            userId: user._id,
            username: user.username,
            email: user.email,
            roles: user.role,
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const signout = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        const user = await User.findOne({ refreshToken }).exec();
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        // Invalidate the refresh token
        user.refreshToken = null;
        await user.save();

        res.status(200).send({ message: "User logged out successfully!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


const refreshToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(403).send({ message: "No refresh token provided!" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }

        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 864000 // 10 days
        });

        // no need to send entire user info, already stored on client-side
        res.status(200).send({
            accessToken: newAccessToken
        });
    });
};


export {
    signup,
    signin,
    signout,
    refreshToken
}; 