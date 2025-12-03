import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js"
import messagesRouter from "./routes/message.route.js"
import path from "path"
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import cors from "cors"
import { ENV } from "./lib/env.js";
import {app,server} from "./lib/socket.js"

dotenv.config();

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

app.use(express.json({limit : "5mb"}));
app.use(cors({
  origin : ENV.CLIENT_URL,
  credentials : true
}))
app.use(cookieParser());



app.use('/api/v1/auth', authRouter);
app.use('/api/v1/messages', messagesRouter);

//make ready for deployment

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));

  app.get("*" ,(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
  })
}


server.listen(PORT,()=> {
  console.log(`Server running at port : ${PORT}`)
  connectDB();
});