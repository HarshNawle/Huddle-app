import { useAppStore } from '@/store/store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactContainer from './components/ContactContainer';
import EmptyChatContainer from './components/EmptyChatContainer';
import ChatContainer from './components/ChatContainer';

const Chat = () => {
  const { 
    userInfo, 
    selectedChatType,
   } = useAppStore();
  const navigate = useNavigate()

  useEffect(() => {
    if(!userInfo.profileSetup){
      toast("Please setup profile to continue.");
      navigate("/profile")
    }
  }, [userInfo, navigate]);
  
  return (
    <div className='h-screen flex overflow-hidden text-white bg-[#26272e]'>
      {/* ContactContainer - hidden on mobile when chat is selected */}
      <div className={`${selectedChatType !== undefined ? 'hidden md:block' : 'flex-1 md:flex-none'} transition-all duration-300`}>
        <ContactContainer/>
      </div>
      {
        selectedChatType === undefined ?
        (<EmptyChatContainer/>) : (<ChatContainer/>)
        
      } 
    </div>
  )
}

export default Chat