import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import {io} from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set,get) => ({
  authUser : null,
  isCheckingAuth : true,
  isSigningUp : false,
  isLoggingIn : false,
  isLoggedOut : false,
  isImageUploading : false,
  socket: null,
  onlineUsers : [],
  checkAuth : async ()=>{
    try{
      const res = await axiosInstance.get("/auth/check");
      set({authUser : res.data});
      get().connectSocket();
    }catch(err){
      set({authUser : null})
    }finally {
      set({isCheckingAuth : false})
    }
  },
  signup : async (data)=>{
    set({isSigningUp :  true})
    try{
      const res = await axiosInstance.post("/auth/signup",data);
      set({authUser : res.data});

      toast.success("Account Created successfully");
      get().connectSocket();
    }
    catch(error){
      toast.error(error.response.data.message);
    }
    finally{
      set({isSigningUp : false})
    }
  },
  login : async (data)=>{
    set({isLoggingIn :  true})
    try{
      const res = await axiosInstance.post("/auth/signin",data);
      console.log(res.data);
      
      set({authUser : res.data});
      toast.success("Logged in successfully");
      get().connectSocket();
    }
    catch(error){
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    finally{
      set({isLoggingIn : false})
    }
  },
  logout : async ()=>{
    set({isLoggedOut :  true})
    try{
      await axiosInstance.post("/auth/logout");
      set({authUser : null});
      get().disconnectSocket();
      toast.success("Logged out successfully");
    }
    catch(error){
      toast.error(error.response.data.message);
    }
    finally{
      set({isLoggedOut : false})
    }
  },
  updateProfile : async (data) =>{
    set({isImageUploading : true})
    try {
      const res = await axiosInstance.put("/auth/update-profile",data);
      set({authUser : res.data});
      toast.success("Profile Updated successfully")
    } catch (error) {
      console.log("Error in update profile:",error);
      toast.error(error.response.data.message);
    }finally{
      set({isImageUploading : false});
    }
  },
  connectSocket : ()=>{
    const {authUser} = get();
    if(!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL,{
      withCredentials : true
    });
    console.log(socket);
    socket.connect();

    set({socket});

    //listen for online users events

    socket.on("getOnlineUsers",(userIds)=>{
      set({onlineUsers : userIds})
    });
  },

  disconnectSocket : ()=>{
    if(get().socket?.connected)
    get().socket.disconnect();
  }
}))