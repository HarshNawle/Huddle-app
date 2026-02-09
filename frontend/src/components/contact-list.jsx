import { useAppStore } from '@/store/store';
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar';
import { HOST } from '@/utils/constants';

const ContactList = ({ contacts, isChannel = false }) => {
    const {
        selectedChatData,
        setSelectedChatData,
        setSelectedChatType,
        setSelectedChatMessages
    } = useAppStore();

    const handleClick = (contacts) => {
        if (isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");
        setSelectedChatData(contacts);

        if (selectedChatData && selectedChatData._id !== contacts._id) {
            setSelectedChatMessages([]);
        }
    }

    return (
        <div className='mt-3 md:mt-5'>
            {
                contacts.map((contact) => (
                    <div key={contact._id} className={`pl-4 md:pl-10 py-2.5 md:py-2 transition-all duration-300 cursor-pointer touch-manipulation
                 ${selectedChatData && selectedChatData._id === contact._id
                            ? "bg-blue-600 hover:bg-blue-400 active:bg-blue-500"
                            : "hover:bg-gray-600 active:bg-gray-500"} 
                 `}
                        onClick={() => handleClick(contact)}
                    >
                        <div className='flex gap-3 md:gap-5 items-center justify-start text-neutral-300'>
                            {
                                !isChannel && (<Avatar className="h-9 w-9 md:h-10 md:w-10 flex-shrink-0">
                                    {
                                        contact?.image ? <AvatarImage
                                            src={`${HOST}/${contact.image}`}
                                            alt='profile'
                                            className='object-cover h-full w-full bg-black'
                                        />
                                            : <div className='uppercase w-9 h-9 md:w-10 md:h-10 
                                    text-base md:text-lg border flex items-center justify-center 
                                    rounded-full bg-gray-700'>
                                                {contact?.firstName?.[0] || contact?.email?.[0] || "U"}
                                            </div>
                                    }
                                </Avatar>
                            )}

                            {
                                isChannel && (<div className='bg-[#ffffff22] h-9 w-9 md:h-10 md:w-10 flex 
                                    items-center justify-center rounded-full flex-shrink-0 text-sm md:text-base'>#</div>)
                            }

                            <span className="text-sm md:text-base truncate flex-1 min-w-0">
                                {isChannel 
                                    ? contact.name 
                                    : `${contact.firstName} ${contact.lastName}`}
                            </span>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ContactList;