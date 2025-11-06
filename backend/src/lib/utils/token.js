import jwt from "jsonwebtoken"
import { ENV } from "../env.js";

export const generateToken = (id,res)=>{
  const token = jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: "1h" });
  res.cookie ("token",token,{
    httpOnly : true,
    sameSite : true,
    secure : ENV.NODE_ENV === "development" ? false : true,
    maxAge : 60*60*1000
  })
}