import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store/store"
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES, HOST } from "@/utils/constants";
import { Download, FolderArchive } from "lucide-react";
import moment from "moment";
import { useEffect, useRef } from "react";


const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    userInfo
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { _id: selectedChatData._id },
          { withCredentials: true }
        );

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if(selectedChatType === "channel") getChannelMessages();
    }
  }, [
    selectedChatData,
    selectedChatType,
    setSelectedChatMessages,
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  }

  // Helper function to parse timestamp (handles number, string, or Date)
  const parseTimestamp = (timestamp) => {
    if (!timestamp) return 0;

    // If it's already a number, use it
    if (typeof timestamp === 'number') {
      return timestamp;
    }

    // If it's a Date object, convert to number
    if (timestamp instanceof Date) {
      return timestamp.getTime();
    }

    // If it's a string, try to parse it
    if (typeof timestamp === 'string') {
      // If it's a numeric string, convert to number
      if (!isNaN(Number(timestamp))) {
        return Number(timestamp);
      }
      // Otherwise try to parse as date string
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? 0 : date.getTime();
    }

    return 0;
  }


  const renderMessages = () => {
    if (!selectedChatMessages || selectedChatMessages.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-lg mb-2">No messages yet</p>
            <p className="text-sm text-gray-500">Start the conversation by sending a message.</p>
          </div>
        </div>
      );
    }

    let lastDate = null;
    return selectedChatMessages.map((messages, index) => {
      const timestamp = parseTimestamp(messages.timestamp);
      const messageDate = moment(timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index} className="mb-4">
          {showDate && (
            <div className="text-center text-gray-400 my-6 text-sm font-medium">
              {moment(timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(messages)}
          {selectedChatType === "channel" && renderChannelMessages(messages)}
        </div>
      )
    })
  };

  const downloadFile = (url) => {
    // Open file in a new tab
    window.open(`${HOST}/${url}`, '_blank');
  };

  const renderDMMessages = (messages) => {
    const isCurrentUser = messages.sender === userInfo?._id || messages.sender?._id === userInfo?._id;

    return (
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
          {
            messages.messageType === "text" && (
              <div className={`${isCurrentUser
                ? "bg-blue-600 text-white"
                : "bg-[#2a2b33] text-gray-100"
                } px-3 py-2 md:px-4 md:py-2.5 rounded-2xl ${isCurrentUser ? 'rounded-br-sm' : 'rounded-bl-sm'
                } shadow-sm wrap-break-word`}>
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">{messages.content}</p>
              </div>
            )
          }
          {
            messages.messageType === "file" && (
              <div className={`${isCurrentUser
                ? "bg-blue-600"
                : "bg-[#2a2b33]"
                } px-2 py-2 md:px-3 md:py-3 rounded-2xl ${isCurrentUser ? 'rounded-br-sm' : 'rounded-bl-sm'
                } shadow-sm`}>
                {checkIfImage(messages.fileUrl) ? (
                  <div
                    className="cursor-pointer group relative inline-block rounded-lg overflow-hidden touch-manipulation"
                    onClick={() => downloadFile(messages.fileUrl)}
                  >
                    <img
                      src={`${HOST}/${messages.fileUrl}`}
                      className="max-h-[200px] max-w-[200px] md:max-h-[300px] md:max-w-[300px] object-cover"
                      alt={messages.fileUrl.split("/").pop()}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Download className="text-white size-8" />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => downloadFile(messages.fileUrl)}
                    className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-90 transition-opacity w-full touch-manipulation"
                  >
                    <span className="text-white/90 bg-black/30 rounded-full p-2 md:p-2.5">
                      <FolderArchive className="w-4 h-4 md:w-5 md:h-5" />
                    </span>
                    <span className="text-white/90 text-xs md:text-sm truncate max-w-[120px] md:max-w-[200px]">
                      {messages.fileUrl.split("/").pop()}
                    </span>
                    <span className="bg-black/30 p-1.5 md:p-2 rounded-full hover:bg-black/50 transition-all">
                      <Download className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </span>
                  </button>
                )}
              </div>
            )
          }
          <div className={`text-xs text-gray-400 mt-1 px-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
            {moment(parseTimestamp(messages.timestamp)).format("h:mm A")}
          </div>
        </div>
      </div>
    )
  };

  const renderChannelMessages = (messages) => {
    const isCurrentUser = messages.sender === userInfo?._id || messages.sender?._id === userInfo?._id;
    const isCurrentUsers = messages.sender._id === userInfo._id

    return (
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
          {
            messages.messageType === "text" && (
              <div className={`${isCurrentUser
                ? "bg-blue-600 text-white"
                : "bg-[#2a2b33] text-gray-100"
                } px-3 py-2 md:px-4 md:py-2.5 rounded-2xl ${isCurrentUser ? 'rounded-br-sm' : 'rounded-bl-sm'
                } shadow-sm wrap-break-word ml-0 md:ml-9`}>
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                  {messages.content}</p>
              </div>
            )
          }

          {
            messages.sender._id !== userInfo._id
              ? (
                <div className="flex items-center justify-start gap-3">
                  <Avatar className='h-8 w-8 rounded-full overflow-hidden'>
                    {
                      messages.sender.image && (
                        <AvatarImage
                          src={`${HOST}/${messages.sender.image}`}
                          alt='profile'
                          className='object-cover h-full w-full bg-black'
                        />
                      )}
                    <AvatarFallback className='uppercase w-8 h-8 md:w-48 md:h-48 
                                    text-lg border flex items-center justify-center 
                                    rounded-full bg-gray-700 text-white'>
                      {messages.sender.firstName
                        ? messages.sender.firstName.split("").shift()
                        : messages.sender.email.split("").shift()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white/60 ">
                    {`${messages.sender.firstName} ${messages.sender.lastName}`}
                  </span>
                  <span className="text-xs text-white/60">
                  {moment(parseTimestamp(messages.timestamp)).format("h:mm A")}
                  </span>
                </div>
              )
              : (
                <div className="text-xs text-white/60 mt-1">
                  {moment(parseTimestamp(messages.timestamp)).format("h:mm A")}
                </div>
              )
          }

          
          {
            messages.messageType === "file" && (
              <div className={`${isCurrentUsers
                ? "bg-blue-600"
                : "bg-[#2a2b33]"
                } px-2 py-2 md:px-3 md:py-3 rounded-2xl ${isCurrentUsers ? 'rounded-br-sm' : 'rounded-bl-sm'
                } shadow-sm`}>
                {checkIfImage(messages.fileUrl) ? (
                  <div
                    className="cursor-pointer group relative inline-block rounded-lg overflow-hidden touch-manipulation"
                    onClick={() => downloadFile(messages.fileUrl)}
                  >
                    <img
                      src={`${HOST}/${messages.fileUrl}`}
                      className="max-h-[200px] max-w-[200px] md:max-h-[300px] md:max-w-[300px] object-cover"
                      alt={messages.fileUrl.split("/").pop()}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Download className="text-white size-8" />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => downloadFile(messages.fileUrl)}
                    className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-90 transition-opacity w-full touch-manipulation"
                  >
                    <span className="text-white/90 bg-black/30 rounded-full p-2 md:p-2.5">
                      <FolderArchive className="w-4 h-4 md:w-5 md:h-5" />
                    </span>
                    <span className="text-white/90 text-xs md:text-sm truncate max-w-[120px] md:max-w-[200px]">
                      {messages.fileUrl.split("/").pop()}
                    </span>
                    <span className="bg-black/30 p-1.5 md:p-2 rounded-full hover:bg-black/50 transition-all">
                      <Download className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </span>
                  </button>
                )}
              </div>
            )
          }
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 overflow-y-auto scrollbar-hidden bg-[#1b1c24] p-3 md:p-6 w-full'>
      <div className="max-w-4xl mx-auto">
        {renderMessages()}
        <div ref={scrollRef} />
      </div>
    </div>
  )
}

export default MessageContainer