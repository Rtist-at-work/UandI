import React from 'react'
import { CiMenuFries,CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoIosNotificationsOutline } from "react-icons/io";



const Header = ({handlemenubartoggle}) => {
  return (
    <header className='relative h-[10%] w-full bg-red-500 flex items-center'>
      <div className='relative flex items-center w-full'>
        <CiMenuFries id='menubar' onClick={handlemenubartoggle} className=' ml-2 text-3xl cursor-pointer'/> 
        {/* <div className='flex items-center my-2 lg:ml-28 sm:ml-8 w-[50%] h-[50%] bg-pink-700 rounded-md '>
          <CiSearch className='text-3xl'/>
          <input type='text' id='searchbar' placeholder='search' className=' ml-2 w-[100%] rounded-md bg-pink-700 outline-none'></input>
        </div>  */}
        <CgProfile className='absolute text-3xl  right-5 top-2'/>
        <IoIosNotificationsOutline className='absolute text-3xl  right-20 top-2'/>
        {/* <button className='absolute border-2 border-black w-40 h-9 right-40 top-1 rounded'>Create</button> */}

      </div>
      
    </header>
  )
}

export default Header
