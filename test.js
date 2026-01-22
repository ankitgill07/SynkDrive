  <div className='  flex items-center group cursor-pointer '>
                        <div className='   '>
                            <img className=' w-11 h-11 rounded-md object-cover ' src={logo} alt="" />
                        </div>
                        <p className=' font-bold font-plusjakartaSans text-xl ml-2 text-black  '>SynkDive</p>
                    </div>
                    <nav>
                        <ul className=' flex items-center gap-x-4 '>
                            {navbar.map((data, index) => (
                                <li key={index} className=' mr-5 relative text-[15px] text-[#4F555C] transition-colors group capitalize hover:text-black  hover:duration-700   font-medium font-inter '>
                                    <Link>
                                        {data}
                                    </Link>
                                    <span className=' absolute -bottom-1 left-0  w-0 group-hover:w-full transition-all   h-0.5 bg-[#155DFC]'></span>
                                </li>

                            ))}
                        </ul>
                    </nav>
                    <div className=' flex items-center gap-x-5'>
                        <button className=' font-medium text-[#4F555C] text-[15px] transition-colors font-inter hover:text-black '>
                            <Link to={"/auth"}>
                                Sign In
                            </Link>
                        </button>
                        <div>
                            <Link to={"/auth"}>
                                <button className=' font-medium cursor-pointer text-[15px] font-inter ml-4  px-5 py-2 rounded-md bg-[#155DFC] text-white '>
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>