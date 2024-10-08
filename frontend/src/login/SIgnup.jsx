import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState('');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validateInput = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    return emailRegex.test(input) || mobileRegex.test(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput(emailOrMobile)) {
      alert('Please enter a valid email or mobile number.');
      return;
    }
    console.log(username)
    console.log(emailOrMobile)
    console.log(username)
    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        username,
        emailOrMobile,
        password,
      });
      if (res.data.status) {
        navigate("/login");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      let statusCode;
      if(axios.isAxiosError(err)){
        statusCode = err.response.status ;
      }
      if(statusCode===400){
        console.log(err)
        alert(err.response.data.errors[0].msg)
      }
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <form
        className="xsm:h-[60%] xsm:w-[90%] border-2 border-black-800 p-8 flex flex-col mt-4 gap-2"
        onSubmit={handleSubmit}
      >
        <h2 className="xsm:text-2xl">SIGN UP</h2>
        <label htmlFor="username" className="xsm:text-sm">
          Username:
        </label>
        <input
          type="text"
          className="xsm:h-8 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Username"
          required
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <label htmlFor="emailOrMobile" className="text-md xsm:text-sm">
          Email or Mobile:
        </label>
        <input
          type="text"
          autoComplete="off"
          required
          placeholder="Email or Mobile"
          onChange={(e) => setEmailOrMobile(e.target.value)}
          value={emailOrMobile}
          className="xsm:h-8 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <label htmlFor="password" className="xsm:text-sm">
          Password:
        </label>
        <input
          type="password"
          className="xsm:h-8 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoComplete="off"
          required
          placeholder="******"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button
          type="submit"
          className="h-8 w-24 border-2 border-black-700 rounded-md mt-4 mx-auto bg-blue-500 text-white"
        >
          Sign Up
        </button>
        <p className="xsm:text-sm xsm:mt-2">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-500">
            Login
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Signup;
