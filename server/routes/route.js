import { Router } from "express";
import { verifyRelation } from "../middlewares/verifyRelation.js";
import { verifyUser } from "../middlewares/verifyUser.js";

import getConversations from "../controllers/getConversations.js";
import postNewConversation from "../controllers/postNewConversation.js";
import getConversation from "../controllers/getConversation.js";
import deleteConversation from "../controllers/deleteConversation.js";
import deleteConversations from "../controllers/deleteConversations.js";

const router = Router();

router.post("/newconversation", postNewConversation);
router.post("/chat", verifyRelation, getConversation);
router.post("/conversations", verifyUser, getConversations);
router.post("/deletechat", verifyRelation, deleteConversation);
router.post("/deleteconversations", verifyUser, deleteConversations);

export default router;
