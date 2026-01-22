
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { sendVerificationCode, usersRegister } from '@/api/AuthApi'
import { CircularProgress } from '@mui/material'
import { toast } from 'sonner'
import VerificationCode from './VerificationCode'
import GoogleAuth from './GoogleAuth'
import GithubAuth from './GithubAuth'


function Signup({ setCurrentAuthPage }) {
  const [showPassword, setShowPassword] = useState(true)
  const [showConfirmPassword, setShowConfirmPassword] = useState(true)
  const [currentStatus, setCurrentStatus] = useState(false)
  const [loading, setloading] = useState(false)
  const { register, control, watch, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      trems: false,
      otp: ""
    },
    mode: "onChange"
  })

  const password = watch("password")



  const sendOtp = async (data) => {
    setloading(true)
    const result = await sendVerificationCode(data.email)
    if (result.success === true) {
      setCurrentAuthPage("otp")
      setCurrentStatus(true)
      toast.success(result.message)
      setloading(false)
    } else {
      toast.error(result.error)
      setloading(false)
    }
  }


  const verifyOtpAndRegister = async (data) => {
    setloading(true)
    const result = await usersRegister(data)
    if (result.success) {
      toast.success(result.success)
      setCurrentAuthPage("signin")
      setloading(false)
    } else {
      toast.error(result.error)
      setloading(false)
    }
  }




  const validatePasswor = (value) => {
    if (!/[A-Z]/.test(value))
      return "Must contain at least one uppercase letter";

    if (!/[a-z]/.test(value))
      return "Must contain at least one lowercase letter";

    if (!/\d/.test(value))
      return "Must contain at least one number";

    if (!/[@$!%*?&]/.test(value))
      return "Must contain at least one special character";

    if (value.length < 8)
      return "Must be at least 8 characters long";

    return true;
  }


  return (
    <div className=' w-full mt-7 '>
      {!currentStatus ? (<>
        <div className=' space-y-2 '>
          <h3 className='text-2xl font-plusjakartaSans font-bold '>Start your free trial</h3>
          <p className=' text-muted-foreground  font-medium font-inter  '>No credit card required</p>
        </div>
        <form onSubmit={handleSubmit(sendOtp)} className='mt-4'>
          <label htmlFor="name" className=' font-medium font-inter text-sm block pb-1 '>Full Name</label>
          <Input {...register("name", {
            required: "Full name is required",
            minLength: {
              value: 3,
              message: "Full name must be 3 character"
            }
          })} placeholder="John Doe" type="text" name="name" className={`placeholder:text-muted-foreground  font-inter  font-medium text-black/80  ${errors.name && ' border-red-600  focus-visible:border-red-600  focus-visible:ring-red-600/50 '}`} />
          {errors.name && <p className='text-red-500 pt-1  text-sm  font-medium font-inter'>{errors.name.message}</p>}
          <label htmlFor="email" className=' font-medium font-inter text-sm block pb-1 mt-4'>Email Address</label>
          <Input {...register("email", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Invalid email address"
            }
          })} placeholder="your@example.com" name="email" className={`placeholder:text-muted-foreground  font-inter  font-medium text-black/80 ${errors.email && ' border-red-600  focus-visible:border-red-600  focus-visible:ring-red-600/50 '}`} />
          {errors.email && <p className='text-red-500 pt-1  text-sm  font-medium font-inter'>{errors.email.message}</p>}
          <label htmlFor="password" className=' font-medium font-inter text-sm block pb-1 mt-4'>Password</label>
          <div className='relative'>
            <Input {...register("password", {
              required: "Password is required",
              validate: validatePasswor
            })} type={showPassword ? "password" : "text"} placeholder="Create a password" name="password" className={`placeholder:text-muted-foreground  font-inter  font-medium text-black/80 ${errors.password && ' border-red-600  focus-visible:border-red-600  focus-visible:ring-red-600/50 '}`} />
            <span onClick={() => setShowPassword(!showPassword)} className=' absolute right-0.5 cursor-pointer  bottom-0.5 rounded-r-md  hover:text-black duration-300 text-gray-500 bg-white p-2'>{showPassword ? <Eye size={16} /> : <EyeOff size={16} />}</span>
          </div>
          {errors.password && <p className='text-red-500 pt-1  text-sm  font-medium font-inter'>{errors.password.message}</p>}
          <label htmlFor="confirmPassword" className=' font-medium font-inter text-sm block pb-1 mt-4'>Confirm Password</label>
          <div className='relative'>
            <Input {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match"
            })} type={showConfirmPassword ? "password" : "text"} name="confirmPassword" placeholder="Confirm your password" className={`placeholder:text-muted-foreground  font-inter  font-medium text-black/80 ${errors.confirmPassword && ' border-red-600  focus-visible:border-red-600  focus-visible:ring-red-600/50 '}`} />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className=' absolute right-0.5 cursor-pointer  bottom-0.5 rounded-r-md  hover:text-black duration-300 text-gray-500 bg-white p-2'>{showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}</span>
          </div>
          {errors.confirmPassword && <p className='text-red-500 pt-1  text-sm  font-medium font-inter'>{errors.confirmPassword.message}</p>}
          <div className=' mt-4   '>
            <label className=' flex items-center cursor-pointer '>
              <Controller
                name='trems'
                {...register("trems", {
                  required: "You must agree to the terms"
                })}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <p className=' font-medium text-black/80 font-inter text-sm ml-1.5 '>I agree to the <span className=' text-[#155DFC] hover:underline'><Link to={'/trem-service'}>
                Trems of Service
              </Link></span> and <span className='text-[#155DFC] hover:underline'><Link>
                Privacy Policy
              </Link></span></p>
            </label>
            {errors.trems && <p className='text-red-500 pt-1  text-sm  font-medium font-inter'>{errors.trems.message}</p>}
          </div>
          <button type='submit' className={`  py-2 rounded-sm  duration-300  w-full text-white font-medium font-inter text-sm mt-4 ${loading ? 'bg-[#155DFC]/60  cursor-no-drop' : 'bg-[#155DFC] hover:bg-[#155DFC]/90'}`}>
            {loading ? <p className=' flex justify-center items-center '><CircularProgress size="17px" className='mr-5 ' sx={{
              color: "white",
              width: 40
            }} />Creating account...</p> : "Create Account"}
          </button>
        </form>
        <div className='w-full my-6 relative'>
          <div className=' absolute inset-0  flex items-center   '>
            <div className=' w-full border-t border-border '> </div>
          </div>
          <div className=' relative text-xs uppercase flex justify-center '>
            <span className=' text-muted-foreground  bg-white  px-1 font-normal   '>Or sign up with</span>
          </div>
        </div>
        <div className='w-full grid grid-cols-2 gap-x-3 '>
          <GoogleAuth />
          <GithubAuth />
        </div>
        <div className=' w-full mt-6 text-center '>
          <p className=' text-sm font-inter  text-muted-foreground  '>Already have an account? <span onClick={() => setCurrentAuthPage("signin")} className='text-[#155DFC] cursor-pointer  font-medium hover:underline'> Sign In</span></p>
        </div>
      </>) : (
        <VerificationCode control={control} onSubmit={handleSubmit(verifyOtpAndRegister)} loading={loading} />
      )}
    </div>
  )
}

export default Signup