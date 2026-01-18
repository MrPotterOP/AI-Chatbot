import Conversation from "../models/conversation.js";
import User from "../models/user.js";
import { isValidId } from "../handlers/verifyUserId.js";
import getConversationTitle from "../handlers/conversationTitle.js";


export default async function postNewConversation(req, res) {
    const { userId, prompt } = req.body;

    if (!userId || !prompt || !isValidId(userId)) {
        return res.status(401).json({ message: "Invalid Request" });
    }

    async function findOrCreateUser(userId) {
        const user = await User.findOneAndUpdate(
            { userId },
            { userId },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        return user;
    }

    async function createConversation(userId, title) {
        const conversation = await Conversation.create({
            userId,
            title,
        });

        return conversation._id;
    }





    try {

        const user = await findOrCreateUser(userId);

        const title = await getConversationTitle(prompt);
        if (!title || !title.trim()) {
            return res.status(500).json({ message: "Service Unavailable" });
        }

        const conversationId = await createConversation(userId, title);
        return res.json({ conversationId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Service Unavailable" });
    }

}


