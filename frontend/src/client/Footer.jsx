import React from 'react'
import { RiInstagramFill } from "react-icons/ri";
import { FaFacebookSquare } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className='relative h-auto w-full bg-gray-200 p-4 xsm:grid xsm:grid-cols-2 my-4'>
                    <div >
                        <h1>SUPPORT</h1>
                        <ul className='ml-6 list-disc underline texm-sm'>
                            <li>shipping</li>
                            <li>return</li>
                            <li>FAQ</li>
                            <li>shipping</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>
                    <div >
                        <h1>ABOUT US</h1>
                        <ul className='ml-6 list-disc underline text-sm'>
                            <li>ABOUT US</li>
                            <li>Our Story</li>
                            <li>Blog</li>
                            <li>Privacy</li>
                            <li>Terms & Conditions</li>
                            <li>Accesibility</li>
                        </ul>
                    </div>
                    <div className=' py-6 w-full  flex items-center col-span-2'>
                        Follow Us 
                        <RiInstagramFill className='xsm:text-3xl mx-2'/>
                        <FaFacebookSquare className='xsm:text-3xl mx-2' />
                       
                    </div>
                    <div className='col-span-2 '>
                        <h1 className='xsm:text-lg    m-2'>U&I</h1>
                        <p className='xsm:text-sm'>Join our  list for updates</p>
                        <form className='flex items-center gap-2'>
                            <input type="email" required class="border-0 border-b border-black focus:outline-none"/>
                            <FaArrowRightLong />
                        </form>                        
                    </div>
                    <div className='col-span-2  my-2'>
                        <p className='xsm:text-sm'>© 2024, U&I.  ALL RIGHTS RESERVED</p>
                    </div>
            </footer>
  )
}

export default Footer
