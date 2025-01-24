import { User } from '../models/user.js';
import { stripeUserCreate, stripeUserUpdate } from './stripeController.js';

const createUser = async (req, res) => {
    const { username, email, password, role, refreshToken } = req.body;

    try {
        const newUser = new User({
            username,
            email,
            password, // hash the password before saving
            role,
            refreshToken,
        });

        await newUser.save();

        stripeUserCreate(newUser);

        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get All Users Without Password
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude the password field
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const updateUser = async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        for (const key of Object.keys(updates)) {
            if (user[key] !== updates[key]) {
                user[key] = updates[key];
            }
        }

        stripeUserUpdate(updates);

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers // admin
};
