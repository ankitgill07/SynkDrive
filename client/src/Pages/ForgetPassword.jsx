
import { Input } from '@/components/ui/input'
import { ArrowLeft, Mail } from 'lucide-react'
import React from 'react'

function ForgetPassword({ setCurrentAuthPage }) {
    return (
        <div className=' w-full '>
            <button onClick={() => setCurrentAuthPage("signin")} className='flex mb-6  items-center cursor-pointer text-sm text-muted-foreground  hover:text-black font-inter font-medium '> <ArrowLeft size={17} className=' mr-1 ' />   <span>  Back to sign in</span></button>

            <div className='  bg-[#155dfc]/10 rounded-lg  text-[#155dfc]  h-12 w-12 flex items-center justify-center '>
                <Mail />
            </div>
            <div className=' my-6 space-y-2 '>
                <h2 className=' text-2xl font-plusjakartaSans font-bold '>Reset your password</h2>
                <p className=' font-medium font-inter text-muted-foreground '>
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <form>
                <label htmlFor="email" className=' font-medium font-inter text-sm block pb-1 '>Email Address</label>
                <Input placeholder="your@example.com" name="email" className="placeholder:text-muted-foreground  font-inter  font-medium text-black/80 " />
                <button className=' bg-[#155DFC] py-2 rounded-sm hover:bg-[#155DFC]/90 duration-300   w-full text-white font-medium font-inter text-sm mt-4 '>
                    Send Reset Link
                </button>
            </form>

        </div>
    )
}

export default ForgetPassword