import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store/store"
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { Edit, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";




const ProfileInfo = () => {
    const {userInfo, setUserInfo} = useAppStore();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const response = await apiClient.post(
                LOGOUT_ROUTE,
                {},
                {withCredentials: true}
            );

            if(response.status === 200) {
                navigate('/auth');
                setUserInfo(undefined);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="h-16 min-h-[60px] flex items-center justify-between w-full
        bg-[#2a2b33] p-2 md:p-1 border-t border-[#2f303b]">
            <div className="flex gap-2 md:gap-3 items-center justify-center flex-1 min-w-0">
                <div className="h-10 w-10 md:h-12 md:w-12 relative flex-shrink-0">
                    <Avatar className='h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden'>
                        {
                            userInfo?.image ? <AvatarImage
                                src={`${HOST}/${userInfo.image}`}
                                alt='profile'
                                className='object-cover h-full w-full bg-black'
                            />
                                : <div className='uppercase w-10 h-10 md:w-12 md:h-12 
                                    text-base md:text-lg border flex items-center justify-center 
                                    rounded-full bg-gray-700'>
                                    {userInfo?.firstName?.[0] || userInfo?.email?.[0] || "U"}
                                </div>
                        }
                    </Avatar>
                </div>
                <div className="font-bold text-sm md:text-base truncate flex-1 min-w-0">
                    {
                        userInfo?.firstName && userInfo.lastName 
                        ? `${userInfo.firstName} ${userInfo.lastName}`
                        : ""
                    }
                </div>
            </div>
            <div className="flex gap-3 md:gap-5 flex-shrink-0">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button 
                                className="p-2 -mr-2 md:p-0 md:mr-0 touch-manipulation"
                                onClick={() => navigate('/profile')}
                                aria-label="Edit Profile"
                            >
                                <Edit className="w-4 h-4 md:w-5 md:h-5 cursor-pointer" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Profile</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button 
                                className="p-2 -mr-2 md:p-0 md:mr-0 touch-manipulation"
                                onClick={logout}
                                aria-label="Logout"
                            >
                                <LogOut className="text-red-500 w-4 h-4 md:w-5 md:h-5 cursor-pointer" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Logout</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default ProfileInfo