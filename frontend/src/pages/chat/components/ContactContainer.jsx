import { RabbitIcon } from 'lucide-react';
import ProfileInfo from './utils/ProfileInfo';
import NewDM from './new-dm';
import { useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS_ROUTES } from '@/utils/constants';
import { useAppStore } from '@/store/store';
import ContactList from '@/components/contact-list';
import CreateChannel from './create-channel';

const ContactContainer = () => {

    const { 
        directMessagesContacts, 
        setDirectMessagesContacts, 
        channels,
        setChannels
    } = useAppStore();

    useEffect(() => {
        const getContact = async () => {
            const response = await apiClient.get(
                GET_DM_CONTACTS_ROUTES, {
                withCredentials: true
            });
            if(response.data.contacts) {
                setDirectMessagesContacts(response.data.contacts);
            }
        };

        const getChannels = async () => {
            const response = await apiClient.get(
                GET_USER_CHANNELS_ROUTES, {
                withCredentials: true
            });
            if(response.data.channels) {
                setChannels(response.data.channels);
            }
        };

        getContact();
        getChannels();
    }, [setChannels, setDirectMessagesContacts]);

  return (
    <div className='relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#26272e] border-r-2 border-[#2f303b] w-full md:w-auto h-screen flex flex-col'>
        <div className="pt-2 flex-shrink-0">
            <Logo/>
        </div>
        <div className="my-3 md:my-5 flex-1 overflow-hidden flex flex-col">
            <div className='flex items-center justify-between pr-4 md:pr-10 mb-2 flex-shrink-0'>
                <Title text="Direct Messages" />
                <NewDM/>
            </div>
            <div className='flex-1 overflow-y-auto scroll-hidden min-h-0'>
                <ContactList contacts={directMessagesContacts} />
            </div>
        </div>
        <div className="my-3 md:my-5 flex-1 overflow-hidden flex flex-col flex-shrink-0">
            <div className='flex items-center justify-between pr-4 md:pr-10 mb-2 flex-shrink-0'>
                <Title text="Channels" />
                <CreateChannel/>
            </div>
            <div className='flex-1 overflow-y-auto scroll-hidden min-h-0'>
                <ContactList contacts={channels} isChannel={true} />
            </div>
        </div>
        <div className="flex-shrink-0">
            <ProfileInfo/>
        </div>
    </div>
  )
}

export default ContactContainer;

const Logo = () => {
    return (
        <div className='flex p-3 md:p-5 justify-start items-center gap-2'>
            <div className='border-3 border-blue-600 
                rounded-full p-1'>
                <RabbitIcon className='w-6 h-6 md:w-7 md:h-7 text-blue-500' />  
            </div>
            <div className='text-xl md:text-2xl font-bold'>
                Huddle
            </div>
        </div>
    )
};


const Title = ({text}) => {
    return (
        <h6 className='uppercase tracking-widest text-neutral-400 pl-4 md:pl-10 font-light text-opacity-90 text-xs md:text-sm'>
            { text }
        </h6>
    )
}