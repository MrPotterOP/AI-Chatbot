import mongoose from "mongoose";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

export default async function deleteConversations(req, res) {
    const { userId } = req.user;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const conversations = await Conversation.find(
            { userId: userId },
            { _id: 1 },
            { session }
        );

        if (conversations.length === 0) {
            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                success: true,
                message: "No conversations to delete"
            });
        }

        const conversationIds = conversations.map(c => c._id);

        await Message.deleteMany(
            { conversationId: { $in: conversationIds } },

            { session }
        );

        await Conversation.deleteMany(
            { _id: { $in: conversationIds } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: `${conversations.length} conversations deleted successfully`
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}
