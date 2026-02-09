import { useAppStore } from "@/store/store";
import { HOST } from "@/utils/constants";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";
import { SocketContext } from "./socketContext";

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo._id },
            });

            socket.current.on("connect", () => {});

            const handleRecieveMessage = (message) => {
                const { selectedChatType, 
                    selectedChatData, 
                    addMessage,
                    addContactsInDMContacts,
                 } =
                    useAppStore.getState();

                if (
                    selectedChatType !== undefined &&
                    (selectedChatData?._id === message.sender._id ||
                        selectedChatData?._id === message.recipient._id)
                ) {
                    addMessage(message);
                }
                addContactsInDMContacts(message);
            };

            const handleRecieveChannelMessage = (message) => {
                const { 
                    selectedChatType,
                    selectedChatData, 
                    addMessage,
                    addChannelInChannelList,
                 } =
                    useAppStore.getState();

                if (
                    selectedChatType !== undefined
                    && selectedChatData._id === message.channelId) {
                    addMessage(message);
                }
                addChannelInChannelList(message)

            };

            socket.current.on("receiveMessage", handleRecieveMessage);
            socket.current.on("recieve-channel-message", handleRecieveChannelMessage);

            return () => {
                socket.current.off("receiveMessage", handleRecieveMessage);
                socket.current.disconnect();
            };
        }
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

