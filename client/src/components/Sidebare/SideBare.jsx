import React from 'react'
import logo from "../../assets/images/logo.png"
import { Image, LayoutDashboard, Star, Trash, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function SideBare() {

  const location = useLocation()



  const SideBareItems = [
    {
      name: "home",
      path: "/drive/home",
      svg: <LayoutDashboard />
    },
    {
      name: "photos",
      path: "/drive/photos",
      svg: <Image />
    },
    {
      name: "shared files",
      path: "/drive/shared-files",
      svg: <Users />
    },
    {
      name: 'favorite',
      path: "/drive/favorite",
      svg: <Star />
    },
    {
      name: 'recycle bin',
      path: "/drive/recycle-bin",
      svg: <Trash />
    },
  ]

  return (
    <div className=' w-65 h-screen  fixed  top-0 left-0    bg-[#F7F5F2] '>
      <div className='w-full  px-3.5 py-4 '>
        <div onClick={() => window.location.reload()} className=' flex items-center px-3 group cursor-pointer mb-5' >
          <div className='   '>
            <img className=' w-10 h-10 rounded-md object-cover ' src={logo} alt="" />
          </div>
          <p className=' font-bold font-plusjakartaSans text-xl ml-2 text-[#1F2933] '>SynkDive</p>
        </div>
        <nav className=' w-full py-4'>
          <ul className=' w-full '>
            {SideBareItems.map((data, index) => (
              <div key={index} className='mb-1.5 '>
                <Link to={`${data.path}`}>
                  <li className={`w-full hover:bg-[#E5DED6] px-3   py-2.5 capitalize cursor-pointer rounded-md font-inter font-medium flex items-center hover:text-[#1B1B1B]  duration-300  ${location.pathname === data.path ? " bg-[#E5DED6] text-[#1B1B1B] " : " bg-transparent text-[#736c64] "}   `}>{data.svg}<p className=' ml-2 text-md '>{data.name}</p></li>
                </Link>
              </div>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default SideBare