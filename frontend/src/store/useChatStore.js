import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";



export const useChatStore = create((set,get)=>({
  allContacts : [],
  chats : [],
  messages : [],
  activeTab : "chats",
  selectedUser : null,
  isUsersLoading : false,
  isMessagesLoading : false,
  typingUser : null,
  isSoundEnabled : JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
  toggleSound : ()=>{
    localStorage.setItem("isSoundEnabled",!get().isSoundEnabled);
    set({isSoundEnabled : !get().isSoundEnabled});
  },
  setActiveTab : (tab) => set({activeTab : tab}),
  setSelectedUser : (selectedUser) => {
    set({selectedUser})
  } ,
  getAllContacts : async ()=>{
    set({isUsersLoading : true})
    try{
      const res = await axiosInstance.get("/messages/contacts");
      set({allContacts : res.data});
    }
    catch(err){
      console.log("Error in chat Store : ",err);
      toast.error(err.response.data.message);
    }finally {
      set({isUsersLoading : false})
    }
  },
  getMyChatPartners : async ()=>{
    set({isUsersLoading : true});
    try{
      const res = await axiosInstance.get("/messages/chats");
      set({chats : res.data});
    }
     catch(err){
      console.log("Error in chat Store : ",err);
      toast.error(err.response.data.message);
    }finally {
      set({isUsersLoading : false})
    }
  },
  getMessagesByUserId : async (userId)=>{
    set({isMessagesLoading : true});
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({messages : res.data});
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went wrong");
    }
    finally{
      set({isMessagesLoading : false});
    }
  },
  sendMessage : async (messageData) =>{
    const {selectedUser,messages} = get();
    const {authUser} = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id : tempId,
      senderId : authUser._id,
      recieverId : selectedUser._id,
      text : messageData.text,
      image : messageData.image,
      createdAt : new Date().toISOString(),
      isOptimistic : true,
    }
    set({messages : messages.concat(optimisticMessage)})
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
      set({messages : messages.concat(res.data)})
    } catch (error) {
      set({messages : messages})
      toast.error(error.response?.data?.message || "Something Went wrong");
    }
  },
  subscribeToMessages : ()=>{
    const {selectedUser} = get();
    if(!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    
    socket.on("newMessage",(newMessage) =>{
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if(!isMessageSentFromSelectedUser) return;
      const { isSoundEnabled} = get();
      const currentMessages = get().messages;
      set({messages : [...currentMessages,newMessage]})
      console.log(get().isSoundEnabled);
      
      if(isSoundEnabled){
        const notificationSound = new Audio('/sounds/notification.mp3')
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e)=>{console.log("Audio play failed : ",e);
        })
      }
    })
    socket.on("typing",({senderId}) =>{
      set({typingUser : senderId})
    });
    socket.on("stop_typing",({senderId}) =>{
      set({typingUser : null})
    })
  },
  unSubscribeFromMessages : ()=>{
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  }
}))