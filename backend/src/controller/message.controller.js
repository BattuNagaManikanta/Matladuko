import Message from "../models/Messages.js"
import { User } from "../models/User.js";

export const getAllContacts = async (req,res)=>{
  try{
    const loggedInUserId = req.user._id;
    const filteredUsers =await User.find({
      _id : {$ne : loggedInUserId}
    }).select("-password");
    res.status(200).json(filteredUsers)
  }
  catch(err){
    console.log("Error Message : ",err);
    res.status(500).json({
      message : "Internal Server error"
    })
  }
}


export const getMessagesByUserId = async (req,res) =>{
  try{
    const myId = req.user._id;
    const {id : userToChatId} = req.params;
    const messages = await Message.find({
      $or :[{senderId : myId , recieverId : userToChatId},{senderId : userToChatId , recieverId : myId}]
    });
    res.status(200).json(messages);
  }
  catch(err){
    console.log("Error Message : ",err);
    res.status(500).json({message : "Internal Server error"})
  }
}

export const sendMessage = async (req,res) =>{
  try{
    const {text,image} = req.body;
    const senderId = req.user._id;
    const {id : recieverId} = req.params;
    if(!text && !image){
      return res.status(400).json({message : "Text or image is required"})
    }
    if(senderId === recieverId){
      return res.status(400).json({message : "Reciever not found"})
    }
    let imageUrl = null;
    if(image){
      const uploadResult = await cloudinary.uploader.upload(profilePic);
      imageUrl = uploadResult.secure_url;
    }
    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      image : imageUrl
    })
    await newMessage.save();
    res.status(200).json(newMessage);
  }
  catch(err){
    console.log("Error Message : ",err);
    res.status(500).json({
      message : "Internal Server Error"
    })
  }
}

export const getChatPartner = async (req,res)=>{
  try{
    const loggedInUserId = req.user._id;
    console.log("Hello");
    
    const messages = await Message.find({
      $or : [{senderId : loggedInUserId},{recieverId : loggedInUserId}]
    })
    console.log(typeof messages[0].senderId);

    const chatPartnerIds =   [...new Set(messages.map( msg => (msg.senderId.toString() === loggedInUserId.toString()) ? msg.recieverId.toString() : msg.senderId.toString()))];  

    const chatPartners = await User.find({_id : {
      $in : chatPartnerIds
    }}).select("-password")
    res.status(200).json(chatPartners); 
  }
  catch(err){
    console.log("Error Message : ",err);
    res.status(500).json({
      message : "Internal Server error"
    })
  }
}