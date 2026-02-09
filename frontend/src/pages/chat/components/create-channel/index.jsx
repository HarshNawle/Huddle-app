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
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import apiClient from "@/lib/api-client"
import { CREATE_CHANNEL_ROUTES, GET_ALL_CONTACTS_ROUTES, HOST, SEARCH_CONTACT_ROUTES } from "@/utils/constants"
import { Button } from "@/components/ui/button"
import MultipleSelector from "@/components/multipleselect"
import { useAppStore } from "@/store/store"


const CreateChannel = () => {

    const { addChannel } = useAppStore();
    const [newChannelModel, setNewChannelModel] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");

    useEffect(() => {
        const getData = async () => {
            const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
                withCredentials: true
            });
            setAllContacts(response.data.contacts);
        };
        getData();
    }, []);

    const createChannel = async () => {
        try {
            if (channelName.length > 0 && selectedContacts.length > 0) {
                const response = await apiClient.post(
                    CREATE_CHANNEL_ROUTES,
                    {
                        name: channelName,
                        members: selectedContacts.map((contact) => contact.value),
                    },
                    { withCredentials: true }
                );
                if(response.status === 201) {
                    setChannelName("");
                    setSelectedContacts([]);
                    setNewChannelModel(false);
                    addChannel(response.data.channel)
                }
            }


        } catch (error) {
            console.log({ error });

        }
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button 
                            className="text-neutral-400 font-light text-start
                            hover:text-neutral-100 cursor-pointer transition-all duration-300 
                            p-1 touch-manipulation"
                            onClick={() => setNewChannelModel(true)}
                            aria-label="Create channel"
                        >
                            <Plus className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Create New Channel</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newChannelModel} onOpenChange={setNewChannelModel} >
                <DialogContent className="bg-[#181920] border-none text-white w-[95vw] max-w-[400px] h-[85vh] max-h-[500px] flex flex-col p-4 md:p-6 gap-4">
                    <DialogHeader>
                        <DialogTitle className="text-base md:text-lg">
                            Please fill up the details for new channel.
                        </DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Channel Name"
                            className="rounded-lg p-4 md:p-6 bg-[#2c2e3b] border-none text-sm md:text-base"
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName} />
                    </div>
                    {/* Multi-select components */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white text-sm md:text-base"
                            defaultOptions={allContacts}
                            placeholder="Search Contact"
                            value={selectedContacts}
                            onChange={setSelectedContacts}
                            emptyIndicator={
                                <p className="text-center text-sm md:text-lg leading-10 text-gray-600">No results found.</p>
                            }
                        />
                    </div>
                    <div>
                        <Button onClick={createChannel}
                            className="text-white w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 
                            transition-all duration-300 cursor-pointer touch-manipulation py-3 md:py-2 text-sm md:text-base">
                            Create Channel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateChannel;