import { useRef, useState } from 'react'
import useKeyboardSound from '../hooks/useKeyboardSound'
import { useChatStore } from '../store/useChatStore';
import { ImageIcon, SendIcon, XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

function MessageInput() {
  const {playRandomKeyStrikeSounds} = useKeyboardSound();
  const [text,setText] = useState("");
  const [imagePreview,setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const {sendMessage,isSoundEnabled} =  useChatStore();
  
  const handleSendMessage = (e) =>{
    e.preventDefault();
    if(!text.trim() && !imagePreview){
      return
    }
    if(isSoundEnabled) playRandomKeyStrikeSounds();
    sendMessage({
      text : text.trim(),
      image : imagePreview,
    })
    setText("");
    setImagePreview("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file.type.startsWith("image/")){
      toast.error("Please select an Image");
      return
    }
    const reader = new FileReader();
    reader.onload = ()=>{
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file);
  }

  const handleRemoveImage = (e) =>{
    setImagePreview(null);
  }

  return (
    <div className='p-4 border-t border-slate-700/50'>
      {imagePreview &&
        <div className='size-16 mb-4 relative'>
          <img className='size-full object-cover ' src={imagePreview} alt='your image'/>
          <button onClick={handleRemoveImage} className='absolute -top-2 -right-2 size-4 bg-black/40 rounded-full'><XIcon className='text-white size-full'/>
          </button>
        </div>
      }
      <div className='flex items-center justify-between'>
        <form onSubmit={handleSendMessage} className='px-2 flex-1 flex items-center space-x-2'>
          <div className='p-2 flex-1'>
            <input type='text' value={text} placeholder='Type your message here....' className='h-8 bg-slate-700 w-full p-4 border-none text-slate-50' onChange={(e) =>{
             setText(e.target.value);
             isSoundEnabled && playRandomKeyStrikeSounds();
          }}/>
          </div>
          <div className=''>
            <ImageIcon className='cursor-pointer' onClick={()=>{
              fileInputRef.current.click();
            }}/>
            <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleImageChange}/>
          </div>
          <button type='submit' disabled = {!text.trim() && !imagePreview} className='bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'>
            <SendIcon className='w-5 h-5'/>
          </button>
        </form>
      </div>
    </div>
  )
}

export default MessageInput
