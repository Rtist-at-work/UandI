import React from 'react'
import uandiLogo from './assets/uandilogo.jpg';
import { IoMdHome} from "react-icons/io";
import { MdOutlineProductionQuantityLimits,MdOutlineChecklist } from "react-icons/md";
import { BiSolidCategory, BiSolidOffer } from "react-icons/bi";

const Sidebar = React.forwardRef(({isSidebarOpen,handlesidebarnav},ref) => {

  

  return (
    <aside className='relative'>
        <img src={uandiLogo} alt='img' className=' relative h-[10%] w-[100%]'></img>
        <ul className='text-sans text-base font-light text-gray-500 space-y-4 '>
          <li id='home' onClick={(e)=>{handlesidebarnav(e)}} className='border-b border-grey-600 py-2 ml-2 hover:text-gray-600 hover:text-xl cursor-pointer transition-all duration-600 flex'><IoMdHome className='text-xl mr-2 '/>Home</li>
          <li id='products'  onClick={(e)=>{handlesidebarnav(e)}} className='border-b border-grey-600 py-2 ml-2 hover:text-gray-600 hover:text-xl cursor-pointer transition-all duration-600 flex'><MdOutlineProductionQuantityLimits className='text-xl mr-2 '/>Products</li>
          <li id='categories' onClick={(e)=>{handlesidebarnav(e)}} className='border-b border-grey-600 py-2 ml-2 hover:text-gray-600 hover:text-xl cursor-pointer transition-all duration-600 flex'><BiSolidCategory className='text-xl mr-2 '/>Categories</li>
          <li id='banners' onClick={(e)=>{handlesidebarnav(e)}} className='border-b border-grey-600 py-2 ml-2 hover:text-gray-600 hover:text-xl cursor-pointer transition-all duration-600 flex'><BiSolidOffer className='text-xl mr-2 '/>Banners</li>
          <li id='orderlist' onClick={(e)=>{handlesidebarnav(e)}} className='border-b border-grey-600 py-2 ml-2 hover:text-gray-600 hover:text-xl cursor-pointer transition-all duration-600 flex'><MdOutlineChecklist className='text-xl mr-2 ' />Orders List</li>
      </ul>
    </aside>
  )
});

export default Sidebar
