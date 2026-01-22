import { CircularProgress } from '@mui/material'
import React from 'react'
import logo from "../../assets/images/logo.png"

function Loader() {
  return (
    <div className=' w-full bg-white h-screen flex justify-center items-center '>
        <div className=' relative'>
        <div>  
          <CircularProgress size={100}/>
        </div>
        <div className=' absolute top-3.5 left-3.5 '>
          <img className=' w-18 object-cover h-18 rounded-full ' src={logo} alt="" />
        </div>
        </div>
    </div>
  )
}

export default Loader