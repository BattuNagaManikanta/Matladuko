import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import { XIcon } from 'lucide-react';

function ChatHeader() {
  const {selectedUser,setSelectedUser} = useChatStore();
  useEffect(()=>{
    function handleEsc(e){
      if(e.key === "Escape"){
        setSelectedUser(null)
      }
    }  
    document.addEventListener("keydown",handleEsc);

    return ()=>document.removeEventListener("keydown",handleEsc)
  },[setSelectedUser]);
  return (
    <div className='flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] p-6 flex-1'>
      <div className='flex items-center space-x-3'>
        <div className='avatar online'>
          <div className='w-12 rounded-full'>
            <img src={selectedUser.profilePic === " " ? "/avatar.png" : selectedUser.profilePic} />
          </div>
      </div>
      <div>
        <h3 className='text-slate-200 font-medium'>{selectedUser.fullName}</h3>
        <p className='text-slate-100 text-sm'>
          online
        </p>
      </div>
      </div>
      <button onClick={()=>setSelectedUser(null)}>
        <XIcon className='w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors' />
      </button>
    </div>
  )
}

export default ChatHeader
