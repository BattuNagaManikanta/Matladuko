import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js"
import messagesRouter from "./routes/message.route.js"

dotenv.config();

const PORT = process.env.PORT;


const app = express();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/messages', messagesRouter);


app.listen(PORT,()=> console.log(`listening at port : ${PORT}`));