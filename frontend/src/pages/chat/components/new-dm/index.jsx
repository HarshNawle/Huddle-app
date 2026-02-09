import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import RabbitSearch from "@/assets/RabbitSearch.gif"
import apiClient from "@/lib/api-client"
import { HOST, SEARCH_CONTACT_ROUTES } from "@/utils/constants"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useAppStore } from "@/store/store"


const NewDM = () => {
    const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [openNewContactModel, setOpenNewContactModel] = useState(false);
    const [searchedContact, setSearchedContact] = useState([]);

    const searchContact = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post(
                    SEARCH_CONTACT_ROUTES,
                    { searchTerm },
                    { withCredentials: true }
                );
                if (response.status === 200 && response.data.contacts) {
                    setSearchedContact(response.data.contacts)
                } else {
                    setSearchedContact([]);
                }
            }
        } catch (error) {
            console.log({ error })
        }
    };

    const selectNewContact = (contact) => {
        setOpenNewContactModel(false);
        setSelectedChatType("contact");
        setSelectedChatData({
            _id: contact._id,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            image: contact.image || undefined,
        });
        setSearchedContact([]);
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button 
                            className="text-neutral-400 font-light text-start
                            hover:text-neutral-100 cursor-pointer transition-all duration-300 
                            p-1 touch-manipulation"
                            onClick={() => setOpenNewContactModel(true)}
                            aria-label="New contact"
                        >
                            <Plus className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Select New Contact</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel} >
                <DialogContent className="bg-[#181920] border-none text-white w-[95vw] max-w-[400px] h-[85vh] max-h-[400px] flex flex-col p-4 md:p-6">
                    <DialogHeader>
                        <DialogTitle className="text-base md:text-lg">
                            Please select a contact
                        </DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Search Contact"
                            className="rounded-lg p-4 md:p-6 bg-[#2c2e3b] border-none text-sm md:text-base"
                            onChange={(e) => searchContact(e.target.value)} />
                    </div>
                    {
                        searchedContact.length > 0 && (
                            <ScrollArea className="flex-1 min-h-0">
                                <div className="flex flex-col gap-3 md:gap-5">
                                    {
                                        searchedContact.map((contact) => (
                                            <div key={contact._id}
                                                className="flex gap-3 items-center cursor-pointer touch-manipulation 
                                                hover:bg-gray-700/50 active:bg-gray-700 rounded-lg p-2 transition-colors"
                                                onClick={() => selectNewContact(contact)}
                                            >
                                                <div className="h-10 w-10 md:h-12 md:w-12 relative flex-shrink-0">
                                                    <Avatar className='h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden'>
                                                        {
                                                            contact?.image ? (<AvatarImage
                                                                src={`${HOST}/${contact.image}`}
                                                                alt='profile'
                                                                className='object-cover h-full w-full bg-black rounded-full'
                                                            />) : (
                                                                <div className='uppercase w-10 h-10 md:w-12 md:h-12 
                                                                text-base md:text-lg border flex items-center justify-center 
                                                                rounded-full bg-gray-700'>
                                                                    {contact?.firstName?.[0] || contact?.email?.[0] || "U"}
                                                                </div>
                                                            )
                                                        }
                                                    </Avatar>
                                                </div>
                                                <div className="flex flex-col text-sm md:text-base truncate flex-1 min-w-0">
                                                    {
                                                        contact.firstName && contact.lastName
                                                            ? `${contact.firstName} ${contact.lastName}`
                                                            : contact.email
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </ScrollArea>
                        )
                    }
                    {
                        searchedContact.length <= 0 && (
                            <div className='flex flex-col mt-2 justify-center items-center duration-1000 transition-all flex-1'>
                                <img src={RabbitSearch}
                                    alt="RabbitSearch" 
                                    className="w-32 md:w-auto max-w-full h-auto" />
                                <div className="text-white flex flex-col gap-3 md:gap-5 items-center 
                            text-base md:text-xl lg:text-2xl transition-all duration-300 text-center px-4">
                                    <h3 className="poppins-medium">
                                        Hi<span className="text-blue-500">! </span>
                                        Search new
                                        <span className="text-blue-600" > Contact </span>
                                        <span className="text-blue-600">.</span>
                                    </h3>
                                </div>
                            </div>
                        )

                    }
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewDM