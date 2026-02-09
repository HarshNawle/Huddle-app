import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/store/store'
import { HOST } from '@/utils/constants';
import { X } from 'lucide-react'

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  return (
    <div className='h-[10vh] min-h-[60px] border-b-2 border-[#2f303b] flex items-center justify-center px-4 md:px-10'>
      <div className='flex gap-3 md:gap-5 items-center w-full justify-between'>
        <div className='flex gap-2 md:gap-3 items-center justify-center flex-1 min-w-0'>
          <div className="h-10 w-10 md:h-12 md:w-12 relative flex-shrink-0">
            {selectedChatType === "contact" ? (
              <Avatar className='h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden'>
                {
                  selectedChatData.image ? <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt='profile'
                    className='object-cover h-full w-full bg-black'
                  />
                    : <div className='uppercase w-10 h-10 md:w-12 md:h-12 
                                    text-base md:text-lg border flex items-center justify-center 
                                    rounded-full bg-gray-700 text-white'>
                      {selectedChatData.firstName
                        ? selectedChatData.firstName.split("").shift()
                        : selectedChatData.email.split("").shift()}
                    </div>
                }
              </Avatar>
            ) : (
              <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>
                #
              </div>
            )}

          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-sm md:text-base font-medium truncate'>
              {selectedChatType === "channel" && selectedChatData.name}
              {
                selectedChatType === "contact" && selectedChatData?.firstName
                  ? `${selectedChatData?.firstName} ${selectedChatData?.lastName}`
                  : selectedChatData?.email
              }
            </div>
          </div>
        </div>


        <div className='flex items-center justify-center gap-3 md:gap-5 flex-shrink-0'>
          <button className='text-neutral-500 focus:border-none 
          focus:outline-none focus:text-white transition-all duration-300
          p-2 -mr-2 md:p-0 md:mr-0 touch-manipulation'
            onClick={closeChat}
            aria-label="Close chat"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader