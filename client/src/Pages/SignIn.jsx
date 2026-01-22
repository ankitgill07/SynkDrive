import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import google from "../assets/images/google.png"
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { usersLogin } from '@/api/AuthApi'
import { toast } from 'sonner'
import { CircularProgress } from '@mui/material'
import GoogleAuth from './GoogleAuth'
import { userAuth } from '@/contextApi/AuthContext'
import GithubAuth from './GithubAuth'

function Signin({ setCurrentAuthPage }) {
    const [showPassword, setShowPassword] = useState(true)
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)
    const { checkAuthorization } = userAuth()




    const navigate = useNavigate()

    const submitForm = async (data) => {
        setLoading(true)
        const result = await usersLogin(data)
        console.log(result);

        if (result.success) {
            setLoading(false)
            toast.success(result.success)
            checkAuthorization()
            return navigate("/drive")
        } else {
            setLoading(false)
            toast.error(result.error)
        }
    }

    return (

        <div className=' w-full mt-7'>
            <div className=' space-y-2 '>
                <h3 className='text-2xl font-plusjakartaSans font-bold  '>Wellcome back</h3>
                <p className=' text-muted-foreground  font-medium font-inter  '>Sign in to access your files</p>
            </div>
            <form onSubmit={handleSubmit(submitForm)} className=' mt-4 '>
                <label htmlFor="email" className=' font-medium font-inter text-sm block pb-1'>Email Address</label>
                <Input {...register("email", {
                    required: "Email is required",
                    pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email address"
                    }
                })} name="email" placeholder="your@example.com" className={`placeholder:text-muted-foreground  font-inter  font-medium text-black/80 ${errors.email && ' border-red-600  focus-visible:border-red-600  focus-visible:ring-red-600/50 '} `} />
                {errors.email && <p className='text-red-500 pt-1  text-sm  font-medium font-inter'>{errors.email.message}</p>}
                <label htmlFor="email" className=' font-medium font-inter text-sm block pb-1 mt-4'>Password</label>
                <div className='relative'>
                    <Input {...register("password", {
                        required: "Password id required"
                    })} type={showPassword ? "password" : "text"} name="password" placeholder="Enter your password" className={`placeholder:text-muted-foreground  font-inter  font-medium text-black/80 ${errors.password && ' border-red-600  focus-visible:border-red-600  focus-visible:ring-red-600/50 '}`} />
                    <span onClick={() => setShowPassword(!showPassword)} className=' absolute right-0.5 cursor-pointer  bottom-0.5 rounded-r-md  hover:text-black duration-300 text-gray-500 bg-white p-2'>{showPassword ? <Eye size={16} /> : <EyeOff size={16} />}</span>
                </div>
                {errors.password && <p className='text-red-500 pt-1  text-sm  font-medium font-inter'>{errors.password.message}</p>}
                <div className=' mt-4 flex items-center justify-between '>
                    <label className=' flex items-center cursor-pointer '>
                        <Checkbox />
                        <p className=' font-medium text-black/80 font-inter text-sm ml-1.5 '>Remember me</p>
                    </label>
                    <p onClick={() => setCurrentAuthPage("forgetPassword")} className=' text-sm font-inter text-[#155DFC] hover:underline font-medium '><Link>
                        Forgot password?
                    </Link></p>
                </div>
                <button type='submit' className={`  py-2 rounded-sm  duration-300  w-full text-white font-medium font-inter text-sm mt-4 ${loading ? "bg-[#155DFC]/60 cursor-no-drop" : 'hover:bg-[#155DFC]/90 bg-[#155DFC] '}`}>
                    {loading ? <p className=' flex justify-center items-center '><CircularProgress size="17px" className='mr-5 ' sx={{
                        color: "white",
                        width: 40
                    }} />Signing In...</p> : "Sign In"}
                </button>
            </form>
            <div className='w-full my-6 relative'>
                <div className=' absolute inset-0  flex items-center   '>
                    <div className=' w-full border-t border-border '> </div>
                </div>
                <div className=' relative text-xs uppercase flex justify-center '>
                    <span className=' text-muted-foreground  bg-white  px-1 font-normal '>Or continue with</span>
                </div>
            </div>
            <div className='w-full grid grid-cols-2 gap-x-3 '>
                <GoogleAuth />
          <GithubAuth/>
            </div>
            <div className=' w-full mt-6 text-center '>
                <p className=' text-sm font-inter  text-muted-foreground  '>Don't have an account? <span onClick={() => setCurrentAuthPage("create")} className='text-[#155DFC] cursor-pointer   font-medium hover:underline'> Sign up</span></p>
            </div>
        </div>
    )
}

export default Signin