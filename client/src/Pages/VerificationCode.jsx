import { usersRegister } from '@/api/AuthApi'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { CircularProgress } from '@mui/material'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import React from 'react'
import { Controller } from 'react-hook-form'

function VerificationCode({ control, loading, onSubmit }) {


    return (
        <div className='w-full'>
            <div className=' space-y-2'>
                <h2 className=' text-2xl font-bold  font-plusjakartaSans '>Enter verification code</h2>
                <p className=' font-medium text-muted-foreground font-inter '>{`We sent a code to  Enter the code to continue.`}</p>
            </div>
            <form onSubmit={onSubmit}>
                <div className=' my-6 ' >
                    <Controller
                        name='otp'
                        control={control}
                        render={({ field }) => (
                            <InputOTP value={field.value} onChange={field.onChange} maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        )} />
                </div>
                <button type='submit' disabled={loading} className=' bg-[#155DFC] py-2 rounded-sm hover:bg-[#155DFC]/90 duration-300   w-full text-white font-medium font-inter text-sm  '>
                    {loading ? (<p>
                        <CircularProgress size='17px' className=' mr-5' /> Verifying...
                    </p>) : "Verify Code"}
                </button>
            </form>
        </div>
    )
}

export default VerificationCode