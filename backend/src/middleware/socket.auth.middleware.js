import jwt from "jsonwebtoken";
import {User} from "../models/User.js";
import { ENV } from "../lib/env.js"; 


export const socketAuthMiddleware = async (socket,next) => {
  try {
    console.log(socket.handshake.headers?.cookie);
    
    const token = socket.handshake.headers?.cookie?.split("; ").find((row) => row.startsWith("token=")).split("=")[1];

    if(!token){
      console.log("Socket connection rejected : No token provided");
      return next(new Error("Unauthorized - No Token provided"));
    }

    const decoded = jwt.verify(token,ENV.JWT_SECRET);
    if(!decoded){
      console.log("Socket Connection rejected : Invalid token");
      return new Error("Unauthorized - Invalid Token");
    }

    const user = await User.findById(decoded.id).select("-password");
    if(!user){
      console.log("socket connection rejected : User not found");
      return next(new Error("User not found"));
    }
    socket.user = user;
    socket.userId = user._id.toString();
    console.log(`socket authenticated for user : ${user.fullName} ${user._id}`);
    
    next();
  } catch (error) {
    console.log("error in socket connection :", error.message);
    next(new Error("Unauthorized - authentication failed"))
    
  }
}