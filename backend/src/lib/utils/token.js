import jwt from "jsonwebtoken"
import { ENV } from "../env.js";

export const generateToken = (id,res)=>{
  const token = jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: "10h" });
  res.cookie ("token",token,{
    httpOnly : true,
    sameSite : true,
    secure : ENV.NODE_ENV === "development" ? false : true,
    maxAge : 10*60*60*1000
  })
}