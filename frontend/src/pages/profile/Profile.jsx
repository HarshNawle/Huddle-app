import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/api-client';
import { useAppStore } from '@/store/store'
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from '@/utils/constants';
import { ArrowLeftIcon, PlusCircle, TrashIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(userInfo?.image ?? null);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!userInfo) return;

    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
    }

    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  // we only want to react to changes of the current user object
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?._id, userInfo?.profileSetup, userInfo?.firstName, userInfo?.lastName, userInfo?.image]);

  const validateProfile = () => {
    if(!firstName){
      toast.error("First Name is required.")
      return false;
    }
    if(!lastName){
      toast.error("Last Name is required.");
      return false;
    }
    return true;
  }

  const saveChanges = async () => {
    if(validateProfile()){
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName },
          {withCredentials: true}
        );
        if(response.status === 200 && response.data.user) {
          setUserInfo(response.data.user);
          toast.success("Profile updated successfully");
          navigate('/chat');
        }
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleNavigate = () => {
    if(userInfo?.profileSetup){
      navigate("/chat");
    } else {
      toast.error("Please setup profile.");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  }

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    console.log({file});
    if(file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,
         formData,
         {withCredentials: true}
      );

      if(response.status === 200 && response.data.image && userInfo) {
        setUserInfo({ ...userInfo, image: response.data.image });
        setImage(`${HOST}/${response.data.image}`);
        toast.success("Image updated successfully.");
      }

      const reader = new FileReader();
      reader.readAsDataURL(file)
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(
        REMOVE_PROFILE_IMAGE_ROUTE,
        { withCredentials: true }
      );

      if(response.status === 200 && userInfo) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully.");
        setImage(null)
      }

    } catch (error) {
      console.log({ error });
      
    }
  }

  return (
    <div className='bg-[#1b1c24] h-screen  flex items-center justify-center gap-10 flex-col'>
      <div className='flex flex-col gap-10 w-[80vw] md:w-max'>
        <ArrowLeftIcon onClick={handleNavigate}
        className='text-4xl lg:text-6xl text-white/90 cursor-pointer' />
        <div className='grid grid-cols-2'>
          <div
            className='h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className='h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden'>
              {
                image ? <AvatarImage
                  src={image}
                  alt='profile'
                  className='object-cover h-full w-full bg-black'
                />
                  : <div className='uppercase w-32 h-32 md:w-48 md:h-48 
              text-5xl border flex items-center justify-center rounded-full bg-gray-700'>
                    {firstName?.[0] || userInfo?.email?.[0] || "U"}
                  </div>
              }
            </Avatar>
            {
              hovered && (
                <div onClick={image ? handleDeleteImage : handleFileInputClick}
                 className='absolute rounded-full
                flex items-center justify-center bg-black/50 ring-fuchsia-50'>
                  {
                    image ? <TrashIcon className='size-10 text-3xl text-white cursor-pointer' /> : <PlusCircle className='size-10 text-3xl text-white cursor-pointer' />
                  }
                </div>
              )
            }
            <input 
              type="file" 
              name='profile-image' 
              ref={fileInputRef} 
              className='hidden' 
              onChange={handleImageChange}
              accept='.png ,.jpg, .jpeg, .svg ,.webp'
            />
          </div>
          {/* Input  */}
          <div className='flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center'>
            <div className='w-full'>
              <Input
                type='email'
                placeholder='Email'
                disabled
                value={userInfo?.email}
                className='rounded-lg p-6  border-none'
              />
            </div>
            <div className='w-full'>
              <Input
                type='text'
                placeholder='First Name'
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className='rounded-lg p-6  border-none'
              />
            </div>
            <div className='w-full'>
              <Input
                type='text'
                placeholder='Last Name'
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className='rounded-lg p-6  border-none'
              />
            </div>

          </div>
        </div>
        <div className='w-full'>
          <Button onClick={saveChanges}
          className='h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 cursor-pointer'>
            Save Changes
          </Button>
        </div>
      </div>


    </div>
  )
}

export default Profile