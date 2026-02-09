import ChatHeader from './utils/ChatHeader'
import MessageBar from './utils/MessageBar'
import MessageContainer from './utils/MessageContainer'

const ChatContainer = () => {
  return (
    <div className='flex-1 h-screen bg-[#1c1d25] flex flex-col w-full md:w-auto'>
      <ChatHeader/>
      <MessageContainer/>
      <MessageBar/>
    </div>
  )
}

export default ChatContainer