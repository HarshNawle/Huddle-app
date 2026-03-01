import { Input } from "@/components/ui/input"
import { Rabbit, Eye, EyeOff } from "lucide-react";
import { useState } from 'react';
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
    const [isSignup, setIsSignup] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateSignup = () => {
        if (!email.length) {
            toast.error("Email is required.");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Password and confirm password should be same.");
            return false;
        }
        return true;
    }

    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email is required.");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required");
            return false;
        }
        return true;
    }

    const handleLogin = async () => {
        if (validateLogin()) {
            const response = await apiClient.post(LOGIN_ROUTE,
                { email, password },
                { withCredentials: true }
            );

            if (response.data.user._id) {
                setUserInfo(response.data.user);
                if (response.data.user.profileSetup) navigate('/chat');
                else navigate('/profile');
            }
        }
    }

    const handleSignup = async () => {
        if (validateSignup()) {
            const response = await apiClient.post(SIGNUP_ROUTE,
                { email, password },
                { withCredentials: true });

            if (response.status === 201) {
                setUserInfo(response.data.user);
                navigate('/profile');
            }
        }
    }

    const handleSubmit = () => {
        if (isSignup) handleSignup();
        else handleLogin();
    }

    const switchMode = () => {
        setIsSignup(!isSignup);
        setPassword("");
        setConfirmpassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
    }

    return (
        <div className="min-h-screen w-full bg-[#1c1d25] flex flex-col overflow-hidden">

            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 md:px-12 py-5 w-full shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full border-[3px] border-blue-600 flex items-center justify-center">
                        <Rabbit className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-lg font-bold text-white">Huddle</span>
                        <span className="text-[10px] text-gray-500 tracking-wide">A Chat Application</span>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200
                            ${!isSignup
                                ? 'text-white relative after:content-[""] after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-0.5 after:bg-blue-500 after:rounded-full'
                                : 'text-gray-500 hover:text-gray-300'}`}
                        onClick={() => { if (isSignup) switchMode(); }}
                    >
                        Sign in
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200
                            ${isSignup
                                ? 'text-white relative after:content-[""] after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-0.5 after:bg-blue-500 after:rounded-full'
                                : 'text-gray-500 hover:text-gray-300'}`}
                        onClick={() => { if (!isSignup) switchMode(); }}
                    >
                        Register
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-12 gap-6 max-w-[1200px] mx-auto w-full">

                {/* Left Side — Hero Text */}
                <div className="relative py-4 md:py-8 text-center md:text-left">
                    {/* Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

                    <h1 className="relative z-10 text-3xl sm:text-4xl md:text-[3.2rem] font-extrabold text-white leading-tight tracking-tight mb-6">
                        {isSignup ? 'Sign up to' : 'Sign in to'}
                        <br />
                        <span className="text-blue-500">
                            {isSignup ? 'Start' : 'Continue'}
                        </span>{' '}
                        Your
                        <br />
                        Conversations
                    </h1>

                    <p className="relative z-10 text-sm text-gray-500 leading-relaxed font-medium">
                        {isSignup
                            ? 'if you already have an account'
                            : "if you don't have an account"}
                        <br />
                        you can{' '}
                        <button
                            className="text-blue-500 font-semibold bg-transparent border-none cursor-pointer text-sm hover:text-blue-400 hover:underline transition-colors duration-200"
                            onClick={switchMode}
                        >
                            {isSignup ? 'login here' : 'register here'}
                        </button>
                    </p>
                </div>

                {/* Right Side — Form */}
                <div className="flex justify-center items-center pb-8 md:pb-0">
                    <div className="w-full max-w-[400px] flex flex-col gap-3.5">

                        {/* Email */}
                        <div className="relative w-full">
                            <Input
                                placeholder="Enter email"
                                type="email"
                                className="w-full h-[3.25rem] px-5 rounded-xl border-none bg-[#2a2b35] text-white text-sm placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-none transition-all duration-300"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="auth-email"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative w-full">
                            <Input
                                placeholder="Enter password"
                                type={showPassword ? "text" : "password"}
                                className="w-full h-[3.25rem] px-5 pr-12 rounded-xl border-none bg-[#2a2b35] text-white text-sm placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-none transition-all duration-300"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="auth-password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-500 cursor-pointer p-1 rounded-md flex items-center justify-center hover:text-blue-400 hover:bg-white/5 transition-all duration-200"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Confirm Password (signup only) */}
                        {isSignup && (
                            <div className="relative w-full animate-[slideDown_0.3s_ease-out]">
                                <Input
                                    placeholder="Confirm password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="w-full h-[3.25rem] px-5 pr-12 rounded-xl border-none bg-[#2a2b35] text-white text-sm placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-none transition-all duration-300"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmpassword(e.target.value)}
                                    id="auth-confirm-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-500 cursor-pointer p-1 rounded-md flex items-center justify-center hover:text-blue-400 hover:bg-white/5 transition-all duration-200"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex={-1}
                                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            className="w-full h-[3.25rem] rounded-full border-none bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold cursor-pointer mt-2 transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_28px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_12px_rgba(37,99,235,0.3)]"
                            onClick={handleSubmit}
                            id="auth-submit"
                        >
                            {isSignup ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth