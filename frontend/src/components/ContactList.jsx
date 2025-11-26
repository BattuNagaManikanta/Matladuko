import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import UsersLoadingSkeleton from './UsersLoadingSkeleton';
import NoChatsFound from './NoChatsFound';

function ContactList() {
  const { allContacts,isUsersLoading,getAllContacts,setSelectedUser }= useChatStore();
  
  useEffect(()=>{
    getAllContacts();
  },[]);
  if(isUsersLoading) return <UsersLoadingSkeleton/>;
  return (
    <div className='flex flex-col gap-2'>
      {allContacts.map((contact)=>(
        <div key={contact._id} onClick={()=>setSelectedUser(contact)} className='bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:b-cyan-500/20 transition-colors'>
          <div className='flex items-center gap-3'>
            <div className='avatar online'>
              <div className='size-12 rounded-full'>
                <img src={(contact.profilePic === " " ? "/avatar.png" : contact.profilePic)} alt={contact.fullName}/>
              </div>
            </div>
            <h4 className='text-slate-200 font-medium truncate'>{contact.fullName}</h4>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ContactList
