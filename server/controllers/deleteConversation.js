import mongoose from "mongoose";
import Message from "../models/message.js";

export default async function deleteConversation(req, res) {
    const conversation = req.conversation;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        await Message.deleteMany(
            { conversationId: conversation._id },
            { session }
        );

        await conversation.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: "Conversation deleted successfully"
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
}
