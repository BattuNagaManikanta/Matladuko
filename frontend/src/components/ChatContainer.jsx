import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceHolder from './NoChatHistoryPlaceHolder';
import { useAuthStore } from '../store/useAuthStore';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';

function ChatContainer() {
  const{ selectedUser, getMessagesByUserId , messages,isMessagesLoading , subscribeToMessages, unSubscribeFromMessages,typingUser} = useChatStore();
  const {authUser} = useAuthStore();

  const chatLastMessageRef = useRef(null);

  // console.log(typingUser);
  console.log(authUser);
  

  function getIstTime(utc){
    return new Date(utc).toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        });
  }
  
  useEffect(()=>{
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    return ()=>{
      unSubscribeFromMessages();
    }
  },[selectedUser,getMessagesByUserId,subscribeToMessages,unSubscribeFromMessages]);

  useEffect(()=>{
    if(chatLastMessageRef.current){
      chatLastMessageRef.current.scrollIntoView({behavior : "smooth"})
    }
  },[messages])

  return (
     <>
        <ChatHeader/>
        <div className='flex-1 px-6 overflow-y-auto py-8'>
          {messages.length > 0 && !isMessagesLoading ? (
          <div className='max-w-3xl mx-auto space-y-6'>
            {messages.map(msg =>{
              console.log(msg.senderId,authUser._id);
              return (<div key={msg._id} className={`chat ${(msg.senderId === authUser._id) ? "chat-end" : "chart-start"}
              }`}>
                <div className={`chat-bubble relative ${msg.senderId === authUser._id ? "bg-cyan-600 text-white" : "bg-cyan-800 text-white"}`}>
                  {msg.image && <img src={msg.image} alt='Shared' className='rounded-lg h-48 object-cover' />}
                  {msg.text &&<div className='break-words max-w-[250px]'>{msg.text}</div> }
                  <div className='text-xs text-slate-300 text-right'>{getIstTime(msg.createdAt)}</div>
                </div>
              </div>)
            })}
            <div ref={chatLastMessageRef}></div>
            {typingUser === selectedUser._id && (
              <div className="text-sm text-gray-500 flex items-center gap-2 px-3 py-1">
                <span className="dot-flashing"></span> typing...
              </div>
            )}
          </div> )
          : isMessagesLoading ? <MessagesLoadingSkeleton/> : <NoChatHistoryPlaceHolder name={selectedUser.fullName}/>}
        </div>
        <MessageInput/>
     </>
  )
}

export default ChatContainer
