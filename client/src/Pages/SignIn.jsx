import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import React from 'react'
import { Link } from 'react-router-dom'
import google from "../assets/images/google.png"
import github from "../assets/images/github.png"
function Signin() {
    return (
        <div className=' w-full'>
            <div className=' space-y-2 '>
                <h3 className='text-2xl font-plusjakartaSans font-bold  '>Wellcome back</h3>
                <p className=' text-muted-foreground  font-medium font-inter  '>Sign in to access your files</p>
            </div>
            <form className=' mt-4 '>
                <label htmlFor="email" className=' font-medium font-inter text-sm block pb-1'>Email Address</label>
                <Input placeholder="your@example.com" className="placeholder:text-muted-foreground  font-inter  font-medium text-black/80 " />
                <label htmlFor="email" className=' font-medium font-inter text-sm block pb-1 mt-4'>Password</label>
                <Input placeholder="Enter your password" className="placeholder:text-muted-foreground  font-inter  font-medium text-black/80 " />
                <div className=' mt-4 flex items-center justify-between '>
                    <label className=' flex items-center cursor-pointer '>
                        <Checkbox />
                        <p className=' font-medium text-black/80 font-inter text-sm ml-1.5 '>Remember me</p>
                    </label>
                    <p className=' text-sm font-inter text-[#155DFC] hover:underline font-medium '><Link>
                        Forgot password?
                    </Link></p>
                </div>
                <button className=' bg-[#155DFC] py-2 rounded-sm hover:bg-[#155DFC]/90 duration-300  w-full text-white font-medium font-inter text-sm mt-4 '>
                    Sign In
                </button>
            </form>
            <div className='w-full my-6 relative'>
                <div className=' absolute inset-0  flex items-center   '>
                    <div className=' w-full border-t border-border '> </div>
                </div>
                <div className=' relative text-xs uppercase flex justify-center '>
                    <span className=' text-muted-foreground  bg-white  px-1 font-normal   '>Or continue with</span>
                </div>
            </div>
            <div className='w-full grid grid-cols-2 gap-x-3 '>
                <button className=' py-2 flex items-center gap-x-3 justify-center border-2 border-gray-100   rounded-md  cursor-pointer    hover:bg-[#155DFC] hover:text-white duration-200'>
                    <img className=' w-4' src={google} alt="google" />
                    <span className=' text-sm font-medium font-inter '>Google</span>
                </button>
                <button className='flex py-2 items-center gap-x-3 justify-center group border-2 border-gray-100 rounded-md  cursor-pointer  hover:bg-[#155DFC] hover:text-white duration-200 '>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="22" height="22" viewBox="0 0 30 30" className=' transition-colors duration-200 '>
                        <path className='group-hover:fill-white' d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z">

                        </path>
                    </svg>
                    <span className='text-sm font-medium font-inter'>GitHub</span>
                </button>
            </div>
            <div className=' w-full mt-6 text-center '>
    <p className=' text-sm font-inter  text-muted-foreground  '>Don't have an account? <Link className='text-[#155DFC]  font-medium hover:underline'> Sign up</Link></p>
            </div>
        </div>
    )
}

export default Signin