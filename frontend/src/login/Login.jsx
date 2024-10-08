import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = ({handleCart,handleWhishlist}) => {
  axios.defaults.withCredentials = true;

  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const {productDetails,selectedSize,navigation} = location.state || {}  ;


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput(emailOrMobile)) {
      alert('Please enter a valid email or mobile number.');
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        emailOrMobile,
        password,
      });
      console.log(res)
  
      if (res.status===200 || res.status===201) {
        if(navigation==="cart"){
          alert(res.data.message); 
          handleCart(e,productDetails,selectedSize)
        }
        else if(navigation==="whishlist"){
          alert(res.data.message); 
          handleWhishlist(productDetails)
          navigate('/productDetails',{state:{product:productDetails}})
          
        }
      }
    } catch (err) {
      if(axios.isAxiosError(err)){
        if(err.response.status===401){
          alert(err.response.data.message);
        }
        else{
          console.log(err)
        }
      }
    }
  };
  
  const validateInput = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    return emailRegex.test(input) || mobileRegex.test(input);
  };

  return (
    <div  className='relative  w-full h-full flex items-center justify-center'>
      <form  onSubmit={handleSubmit} className='xsm:min-h-max xsm:w-[90%] border-2 border-black-800 p-8 '>
        <h2 className='xsm:text-2xl'>Login</h2>
        <div className='flex flex-col mt-4 gap-2'>
        <label htmlFor='emailOrMobile' className='text-md xsm:text-sm'>Email or Mobile:</label>
          <input
            type='text'
            autoComplete='off'
            placeholder='Email or Mobile'
            onChange={(e) => setEmailOrMobile(e.target.value)}
            value={emailOrMobile}
            className='xsm:h-8 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />

          <nobr>
            <label htmlFor='password' className='text-md xsm:text-sm'>Password :</label> 
            <Link to='/forgotpassword' className='ml-32 xsm:ml-10 underline xsm:text-sm  text-blue-500'>Forgot password</Link>
          </nobr>
          <input 
            type='password' 
            autoComplete='off' 
            placeholder='******' 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            className='xsm:h-8 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
          <button 
          className='h-8 w-24 border-2 border-black-700 rounded mt-4 mx-auto bg-blue-500 text-white'
            type='submit' 
            
          >
            Login
          </button>
          <p className='mt-4 xsm:text-sm text-md-'>Already have an account? <Link to='/signup' className='underline text-blue-500'>Sign Up</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
