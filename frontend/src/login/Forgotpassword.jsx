import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Forgotpassword = () => {

    axios.defaults.withCredentials = true;

    const [email,setEmail] = useState();

    const navigate = useNavigate();

        const handleSubmit = async (e)=> {
            e.preventDefault();
            try{
                const res = await axios.post("http://localhost:5000/auth/forgotpassword",{
                    email,                
                })
                if(res.data.status){
                    navigate('/login')
                }
            }
            catch(err){
                console.log(err)
            }
        }


  return (
    <div className='relative  w-full h-full flex items-center justify-center'>
        
        <form className='xsm:h-[35%] xsm:w-[90%] border-2 border-black-800 p-8 flex flex-col mt-4 gap-2' onSubmit={handleSubmit}>
            <h2 className='xsm:text-xl mx-auto'>ForgotPassword</h2>
            <label htmlFor='email' className='text-md xsm:text-md '>Email:</label>
            <input type='email' 
            className='xsm:h-8 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            autoComplete='off' placeholder='Email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
            <button type='submit' className='h-8 w-24 border-2 border-black-700 rounded mt-4 mx-auto bg-blue-500 text-white'>Send</button>
        </form>
      
    </div>
  )
}

export default Forgotpassword
