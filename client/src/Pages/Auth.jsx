import React, { useState } from 'react'
import secondlogo from "../assets/images/secondlogo.png"
import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, Folder, Shield, Smartphone } from 'lucide-react'
import Signin from './SignIn'
import Signup from './Signup'
import { motion, AnimatePresence } from "motion/react"
import ForgetPassword from './ForgetPassword'


function Auth() {
    const [currentAuthPage, setCurrentAuthPage] = useState("signin")


    return (
        <div className=' w-full h-screen flex items-center justify-center  '>
            <div className=' mx-auto  flex  rounded-md  '>
                <div className=' flex flex-col justify-between px-10 py-11  bg-[#155DFC] rounded-l-md '>
                    <div>
                        <div className=' mb-8  '>
                            <Link to={'/drive'}>
                                <div className=' flex items-center '>
                                    <img className=' object-cover w-8 h-8 rounded-md ' src={secondlogo} alt="" />
                                    <p className=' text-white font-bold font-plusjakartaSans  text-xl ml-2.5  '>SynkDrive</p>
                                </div>
                            </Link>
                        </div>

                        <div className=' mt-6 text-white'>
                            <h2 className=' font-bold font-plusjakartaSans text-3xl  '>
                                Access your, <br /> Files anywhere.<br /> Securely.
                            </h2>
                            <p className=' mt-3 font-medium font-inter text-white/80 '>
                                A new cloud storage platform <br />  focused on reliability and trust.
                            </p>
                            <ul className=' my-8'>
                                <li className=' flex mb-4 items-center font-inter font-medium'>
                                    <div className=' bg-[#3D7AFC] p-2 mr-3  rounded-md   '>
                                        <Shield size={18} strokeWidth={1.8} />
                                    </div>
                                    <p className=' text-sm '>End-to-end encryption</p>
                                </li>
                                <li className=' flex mb-4 items-center font-inter font-medium'>
                                    <div className=' bg-[#3D7AFC] p-2  mr-3  rounded-md'>
                                        <Smartphone size={18} strokeWidth={1.9} />
                                    </div>
                                    <p className=' text-sm '>Access from any devic</p>
                                </li>
                                <li className=' flex items-center font-inter font-medium'>
                                    <div className=' bg-[#3D7AFC] p-2 mr-3  rounded-md'>
                                        <FileText size={18} strokeWidth={1.9} />
                                    </div>
                                    <p className=' text-sm '>Intelligent File Management</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <div className='relative mb-8'>
                            <div className="absolute -inset-4 bg-primary-foreground/10 rounded-2xl blur-2xl"></div>
                            <div className=' bg-white/10 p-6    backdrop-blur-sm rounded-md text-white border border-white/20    px-4 '>
                                <div className=' flex items-center mb-4'>
                                    <div className=' w-3 h-3 mr-3 rounded-full bg-[#05DF72]'></div>
                                    <span className=' text-xs  font-medium font-inter text-white/80 '>All Files Synced</span>
                                </div>
                                <div className=' space-y-2'>
                                    {['Documents', 'Photos', "Projects"].map((folder, i) => (
                                        <div key={i} className=' flex items-center  justify-between  opacity-70 '>
                                            <div className=' flex items-center mr-34 '>
                                                <p className=' bg-white/20 rounded-sm mr-2 w-6 h-6 flex items-center justify-center '><Folder size={13} /></p>
                                                <p className=' text-xs font-medium font-inter'>{folder}</p>
                                            </div>
                                            <p className='text-xs   font-medium font-inter ' >{(i + 1) * 12} files</p>
                                        </div>
                                    ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className=' text-white flex items-center gap-2 opacity-70 '>
                            <span><Shield size={17} /></span>
                            <p className=' text-xs font-medium font-inter '>256-bits SLL/TLS encrypted</p>
                        </div>
                    </div>
                </div>
                <div className=' border-t w-lg  bg-white shadow-2xl p-11   rounded-r-md '>
                    <div>
                        {!["forgetPassword", "otp"].includes(currentAuthPage) ?
                            <div className=' flex bg-gray-50  p-1  rounded-lg '>
                                <button onClick={() => setCurrentAuthPage("signin")} className={`text-sm flex-1  cursor-pointer outline-0    transition-all font-inter font-medium px-4  py-2.5 hover:text-black    rounded-md ${currentAuthPage === "signin" ? 'bg-white shadow-sm  text-black ' : "bg-transparent text-[#4F555C]"}`}>Sign In</button>
                                <button onClick={() => setCurrentAuthPage("create")} className={` text-sm flex-1 cursor-pointer outline-0  transition-all font-inter font-medium px-4 py-2.5 hover:text-black  rounded-md   text-[#4F555C] ${currentAuthPage === "create" ? 'bg-white shadow-sm  text-black ' : "bg-transparent text-[#4F555C]"}`}>Create Account</button>
                            </div>
                            : ""
                        }
                        <div className='  transition-all '>
                            <AnimatePresence mode='wait'>
                                {currentAuthPage === "signin" &&
                                    (
                                        <motion.div
                                            key="signin"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Signin setCurrentAuthPage={setCurrentAuthPage} />
                                        </motion.div>
                                    )

                                }
                                {['otp', "create"].includes(currentAuthPage) && (

                                    <motion.div
                                        key="create"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Signup setCurrentAuthPage={setCurrentAuthPage} currentAuthPage={currentAuthPage} />
                                    </motion.div>
                                )}

                                {
                                    currentAuthPage === "forgetPassword" && (
                                        <motion.div
                                            key="forgetPassword"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ForgetPassword setCurrentAuthPage={setCurrentAuthPage} />
                                        </motion.div>
                                    )
                                }
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth