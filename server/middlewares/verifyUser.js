import { User } from "../models/user.js";

const checkUserExists = async (req, res, next) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
        return res.status(404).json({ error: 'User not found' });
    }

    next();
};

export { checkUserExists };