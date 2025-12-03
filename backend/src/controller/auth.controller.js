
import { sendEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils/token.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res)=>{
  const {fullName,email,password} = req.body;
  if(!fullName || !email || !password) {
    return res.status(400).json({message : "Fields are missing"});
  }
  if(password.length < 6){
    return res.status(400).json({message : "password length must be atleast 6"});
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email)){
    return res.status(400).json({message : "Not a valid email id"});
  }
  try{
    
    const userExists = await User.findOne({email});
    if(userExists){
      return res.status(400).json({message : "User Already exists try with a different mail or login"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      password : hashedPassword,
      email,
      profilePic : " "
    })
    if(newUser){
      sendEmail(newUser.email,newUser.fullName,process.env.CLIENT_URL);
      await newUser.save();
      generateToken(newUser._id,res);
      return res.status(201).json({
        _id : newUser._id,
        fullName : newUser.fullName,
        email : newUser.email,
        profilePic : newUser.profilePic
      });
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({message : "Internal Server error"})
  }
}


export const signin = async (req,res) => {
  const {email,password} = req.body;
  try{
    const findUser = await User.findOne({email});
    if(!findUser){
      return res.status(400).json({message : " Invalid credentials"});
    }
    const isValid = await bcrypt.compare(password,findUser.password);
    if(!isValid){
      return res.status(400).json({message : " Invalid credentials"});
    }
    generateToken(findUser._id,res);
    res.status(200).json({
      _id : findUser._id,
      email : findUser.email,
      fullName : findUser.fullName,
      profilePic : findUser.profilePic
    })  
  }
  catch(err){
    console.log("Error message :", err);
    res.status(500).json({message : "Internal Server Error"});
  }
}

export const logout = async (_,res) =>{
  res.clearCookie("token");
  res.status(200).json({message : "logged out successfully"})
}


export const updateProfile = async (req,res)=>{
  try {const {profilePic} = req.body;
  if(!profilePic) return res.status(400).json({message : "profile pic is required"});
  const uploadResult = await cloudinary.uploader.upload(profilePic);
  const userId = req.user._id;
  const updatedUser = await User.findByIdAndUpdate(userId,{profilePic : uploadResult.secure_url},{new : true});
  res.status(200).json(updatedUser);
  }
  catch(err){
    console.log(err);
    res.status(500).json({message : "Internal server error"})
  }
}