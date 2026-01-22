import React from 'react'
import Container from '../container/container'
import { Bell, Cloud, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { userAuth } from '@/contextApi/AuthContext'
import { IoIosSearch } from "react-icons/io";
import SideBare from '../Sidebare/SideBare'
function Header() {


    const { user } = userAuth()
    console.log(user);

    return (
        <div className=' fixed top-0 left-65 w-[calc(100%-260px)] bg-white z-10 '>
            <header className=' w-full px-6 py-4  '>
                <div className=' w-full flex justify-between  items-center'>
                    <form className=' w-1/2 border flex items-center px-4 py-1.5  rounded-lg border-[#00000024]  outline-black hover:border-black'>
                        <span className=' text-gray-500'><IoIosSearch size={21} strokeWidth={4} /></span>
                        <input type="text" className=' outline-0 w-full  px-2  font-inter     ' placeholder='Search' />
                    </form>
                    <div className=' flex gap-x-3 items-center justify-end'>
                        <button className=' bg-[#d9d4cc3b] flex items-center    rounded-md cursor-pointer  font-bold  px-4 py-2  font-plusjakartaSans hover:bg-[#e9e8e8] duration-300 '><UserPlus size={20} className='  mr-1.5 ' /><span>Invite members</span></button>
                        <button className=' bg-[#d9d4cc3b] flex items-center   rounded-md cursor-pointer  font-bold  px-4 py-2  font-plusjakartaSans hover:bg-[#155dfc]  duration-300 hover:text-white '><span>Click to upgrade</span></button>

                        <button className=' cursor-pointer '>   <Bell /></button>
                        <div className=' flex items-center hover:bg-[#d9d4cc3b]   px-3 py-1 rounded-md  cursor-pointer '>
                            <div className=' mr-2'>
                                <img className='w-8 h-8 object-cover rounded-full ' src={user.picture} alt="" />
                            </div>
                            <div>
                                <p className=' font-inter font-medium '>{user.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header