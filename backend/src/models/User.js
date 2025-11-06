import mongoose from "mongoose";


const userSchema= mongoose.Schema({
    email :{
      type : String,
      unique : true,
      required : true
    },
    fullName :{
      type : String,
      required : true
    },
    password : {
      type : String,
      required : true,
      length : 6
    },
    profilePic : {
      type : String,
      default : "",
    }
},{
  timestamps :true
})

export const User = mongoose.model("User",userSchema);