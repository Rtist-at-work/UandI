import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';


const Resetpassword = () => {
//mmvml

    axios.defaults.withCredentials = true;

    const [password,setPassword] = useState("");
    const{token} = useParams();

    const navigate = useNavigate();

        const handleSubmit = async (e)=> {
            console.log(e);
            e.preventDefault();
            try{
                const res = await axios.post(`http://localhost:5000/auth/resetpassword/${token}`,{
                    password,                
                })
                console.log(res);
                if(res.data.status){
                    console.log(res.data.status)
                    alert("password Updated");
                    navigate('/login')
                }
            }
            catch(err){
                console.log(err)
            }
        }


  return (
    <div className='relative p-8 h-[90%] w-[100%]'>
        <h2>ResetPassword</h2>
        <form className='' onSubmit={handleSubmit}>
            <label htmlFor='password'>New Password:</label>
            <input type='password' placeholder='*******' onChange={(e)=>setPassword(e.target.value)} value={password}/>
            <button type='submit'>Reset</button>
        </form>
      
    </div>
  )
}

export default Resetpassword
