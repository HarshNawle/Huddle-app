import image1 from "@/assets/Contact us.gif"

const EmptyChatContainer = () => {
  return (
    <div className='hidden md:flex flex-1 md:bg-[#1c1d25] flex-col justify-center items-center duration-1000 transition-all'>
        <img src={image1} 
        alt="image1" 
        className="w-64 md:w-auto max-w-full h-auto" />
        <div className="text-white flex flex-col gap-3 md:gap-5 items-center mt-6 md:mt-10
        text-2xl md:text-3xl lg:text-4xl transition-all duration-300 text-center px-4">
            <h3 className="poppins-medium">
                Hi<span className="text-blue-500">! </span>
                Welcome to
                <span className="text-blue-600" > Huddle </span>
                 Chat App
                <span className="text-blue-600">.</span>
            </h3>
        </div>
        <div className="flex mt-3 md:mt-5 text-gray-500 px-4 text-center">
            <p className="text-sm md:text-base">Select a profile to begin a chat</p>
        </div>
    </div>
  )
}

export default EmptyChatContainer