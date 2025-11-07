import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { ENV } from '../lib/env.js'

export const protectRoute =async (req,res,next)=>{
  try{
    const token = req.cookies.token;
    if(!token) {
      return res.status(401).json({message : "Unauthorized - No token provided"})
    }
    const decoded = jwt.verify(token,ENV.JWT_SECRET);
    if(!decoded){
      return res.status(400).json({message : "Unauthorized - Invalid token provided"})
    }
    const user = await User.findOne({_id : decoded.id}).select("-password");
    req.user = user;
    next();
  }
  catch(err){
    console.log("Error Message : ",err);
    res.status(500).json({message : "Internal server error"})
  }
}