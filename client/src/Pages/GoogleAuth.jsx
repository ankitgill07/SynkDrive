import React from 'react'
import google from "../assets/images/google.png"
import { useGoogleLogin } from '@react-oauth/google';
import { googleLogin } from '@/api/AuthApi';
import { useNavigate } from 'react-router-dom';
import { userAuth } from '@/contextApi/AuthContext';

function GoogleAuth() {
  const { checkAuthorization } = userAuth()

  const navigate = useNavigate()

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      const { code } = response;
      const result = await googleLogin(code)
      if (result.success) {
        checkAuthorization()
        return navigate("/drive/home")
      }
    },
    onError: () => setError("Google login failed. Please try again."),
    flow: "auth-code",
  });




  return (
    <>
      <button onClick={() => login()} className=' py-2 flex items-center gap-x-3 justify-center border-2 border-gray-100   rounded-md  cursor-pointer    hover:bg-[#155DFC] hover:text-white duration-200'>
        <img className=' w-4' src={google} alt="google" />
        <span className=' text-sm font-medium font-inter '>Google</span>
      </button>
    </>
  )
}

export default GoogleAuth