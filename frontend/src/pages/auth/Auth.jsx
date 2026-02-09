import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Rabbit } from "lucide-react";
import { useState } from 'react';
import SideImageLogin from "@/assets/people-talking.png"
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/store";


const Auth = () => {
    const navigate = useNavigate();
    const { setUserInfo } = useAppStore()

     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [confirmPassword, setConfirmpassword] = useState("");

     const validateSignup = () => {
        if(!email.length){
            toast.error("Email is required.");
            return false;
        }
        if(!password.length){
            toast.error("Password is required");
            return false;
        }
        if(password !== confirmPassword){
            toast.error("Password and confirm password should be same.");
            return false;
        }
        return true;
     }

     const validateLogin = () => {
        if(!email.length){
            toast.error("Email is required.");
            return false;
        }
        if(!password.length){
            toast.error("Password is required");
            return false;
        }
        return true;
     }

     const handleLogin = async () => {
        if(validateLogin()) {
            const response = await apiClient.post(LOGIN_ROUTE, 
                {email, password}, 
                {withCredentials:true}
            );
            
            if(response.data.user._id){
                setUserInfo(response.data.user);
                if(response.data.user.profileSetup) navigate('/chat');
                else navigate('/profile');
            }
        }
     }
     const handleSignup = async () => {
        if(validateSignup()){
            const response = await apiClient.post(SIGNUP_ROUTE, 
                {email, password}, 
                {withCredentials: true});

            if(response.status === 201){
                setUserInfo(response.data.user);
                navigate('/profile');
            }
        }
        
     }



    return (
        <div className='h-screen w-screen  flex items-center justify-center'>
            <div className='h-[80vh] bg-white border-white text-opacity-90
        shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 dark:bg-black'>
                <div className='flex flex-col gap-10 items-center justify-center' >
                    {/* Heading */}
                    <div className='flex items-center justify-center flex-col' >
                        <div className='flex items-center justify-center gap-2' >
                            <h1 className='text-5xl font-bold md:text-6xl dark:text-white' >Welcome</h1>
                            <div className='p-1 border-2 border-white rounded-full flex items-center justify-center'>
                                <Rabbit className='size-10 md:size-10 dark:text-white' />
                            </div>
                        </div>

                        <p className='font-medium text-center dark:text-white'>
                        Get started—your chat journey begins here.
                        </p>
                    </div>

                    <div className="flex items-center justify-center w-full">
                        <Tabs defaultValue="signup" className="w-3/4" >
                            <TabsList className="bg-transparent w-full rounded-none dark:text-white">
                                <TabsTrigger value="signup"
                                    className="cursor-pointer data-[state=active]:bg-transparent  text-opacity-90
                                    border-b-2 rounded-xl w-full data-[state=active]:text-black data-[state=active]:font-semibold
                                    data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 dark:text-white"
                                >Signup</TabsTrigger>
                                <TabsTrigger value="login"
                                    className="cursor-pointer data-[state=active]:bg-transparent text-black text-opacity-90
                                border-b-2 rounded-xl w-full data-[state=active]:text-black data-[state=active]:font-semibold
                                data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 dark:text-white" >Login</TabsTrigger>
                            </TabsList>
                            {/* Signup Content */}
                            <TabsContent className="flex flex-col gap-5 mt-8 dark:text-white" 
                            value="signup" >
                                <Input 
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full dark:text-white p-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input 
                                    placeholder="Password"
                                    type="password"
                                    className="rounded-full dark:text-white p-6"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Input 
                                    placeholder="Confirm Password"
                                    type="password"
                                    className="rounded-full dark:text-white p-6"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmpassword(e.target.value)}
                                />
                                <Button className="p-6 rounded-full cursor-pointer"
                                onClick={handleSignup} >
                                    Signup
                                </Button>
                            </TabsContent>
                            {/* Login Content */}
                            <TabsContent className="flex flex-col gap-5 mt-10" 
                            value="login" >
                                <Input 
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full dark:text-white p-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input 
                                    placeholder="Password"
                                    type="password"
                                    className="rounded-full dark:text-white p-6"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                /> 
                                <Button className="p-6 rounded-full cursor-pointer "
                                onClick={handleLogin} >
                                    Login
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                {/* Side Image  */}
                <div className="hidden xl:flex justify-center items-center">
                    <img src={SideImageLogin} alt="background login"/>
                </div>
            </div>
        </div>
    )
}

export default Auth