import { isValidId } from "../handlers/verifyUserId.js";
import User from "../models/user.js";


export async function verifyUser(req, res, next) {
    const userId = req.body?.userId;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    if (!isValidId(userId)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;
    next();
}