import { PaperclipIcon, Send, SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { useAppStore } from "@/store/store";
import { useSocket } from "@/context/useSocket";
import apiClient from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";



const MessageBar = () => {
  const emojiRef = useRef(null);
  const fileInputRef = useRef();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();

  useEffect(() => {
    function handleClickOutSide(event) {
      if (emojiRef.current && event.target instanceof Node && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide)
    }
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  }


  const handleSendMessage = async () => {
    if (!socket) return;

    if (selectedChatType === "contact") {
      const payload = {
        sender: userInfo._id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined
      }
      socket.emit("sendMessage", payload);
    }
    else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo._id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiClient.post(UPLOAD_FILE_ROUTE,
          formData,
          { withCredentials: true }
        )

        if (response.status === 200 && response.data) {
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo._id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            })
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo._id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
              channelId: selectedChatData._id,
            })
          }
        }

      }
      console.log({ file });

    } catch (error) {
      console.log({ error });

    }
  }


  return (
    <div className="h-[10vh] min-h-[60px] bg-[#1c1d25] flex items-center px-3 md:px-8 gap-2">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-2 md:gap-5 pr-2 md:pr-5">
        <input type="text"
          className="flex-1 p-3 md:p-5 bg-transparent rounded-md 
          focus:border-none focus:outline-none text-sm md:text-base
          placeholder:text-gray-500"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }} />

        <button className='text-neutral-500 focus:border-none 
          focus:outline-none focus:text-white transition-all duration-300
          p-2 touch-manipulation flex-shrink-0'
          onClick={handleAttachmentClick}
          aria-label="Attach file"
        >
          <PaperclipIcon className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <input type="file" className="hidden" ref={fileInputRef}
          onChange={handleAttachmentChange} />

        <div className="relative flex-shrink-0">
          <button className='text-neutral-500 focus:border-none 
            focus:outline-none focus:text-white transition-all duration-300
            p-2 touch-manipulation'
            onClick={() => setEmojiPickerOpen(true)}
            aria-label="Add emoji"
          >
            <SmilePlus className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {emojiPickerOpen && (
            <div className="absolute bottom-16 right-0 md:right-8 z-50" ref={emojiRef}>
              <div className="scale-75 md:scale-100 origin-bottom-right">
                <EmojiPicker
                  theme={Theme.DARK}
                  onEmojiClick={handleAddEmoji}
                  autoFocusSearch={false}
                />
              </div>
            </div>
          )}
        </div>

      </div>
      <button className='bg-blue-600 rounded-md flex items-center
          justify-center p-3 md:p-5 hover:bg-blue-700 focus:border-none cursor-pointer
          focus:outline-none focus:text-white transition-all duration-300
          touch-manipulation flex-shrink-0 active:scale-95'
        onClick={handleSendMessage}
        aria-label="Send message"
      >
        <Send className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  )
}

export default MessageBar