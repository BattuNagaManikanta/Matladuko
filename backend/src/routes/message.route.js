import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllContacts, getChatPartner, getMessagesByUserId, sendMessage } from "../controller/message.controller.js";
// import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(protectRoute)

router.get('/contacts',getAllContacts);

router.get('/chats',getChatPartner);

router.get('/:id',getMessagesByUserId);

router.post('/send/:id',sendMessage)



export default router;