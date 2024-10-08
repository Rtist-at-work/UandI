import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBorderAll } from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import uandiLogo from "../assets/uandilogo.jpg";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const URI = "http://localhost:5000";
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    gender: "",
    mobile: "",
    email: "",
    username: "",
    password: "",
  });
  const [reset, setReset] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [newPassword,setNewPassword]= useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const [updateId, setUpdateId] = useState();

  const userDetails = async () => {

    try {
      const response = await axios.get(`${URI}/profile/getUser`);
      setUpdateId(response.data._id);
      setPersonalInfo({
        name: response.data.personalInfo.name,
        email: response.data.personalInfo.email,
        mobile: response.data.personalInfo.mobile,
        username: response.data.personalInfo.username,
        gender: response.data.personalInfo.gender,
        password: response.data.personalInfo.password,
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    userDetails();
  }, []);
  // Handle input changes for all fields
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (value === "Male") setPersonalInfo({ ...personalInfo, gender: value });
    else if (value === "Female")
      setPersonalInfo({ ...personalInfo, gender: value });
    else if (value === "Transgender")
      setPersonalInfo({ ...personalInfo, gender: value });
    else if (id === "mobile")
      setPersonalInfo({ ...personalInfo, mobile: value });
    else if (id === "email") setPersonalInfo({ ...personalInfo, email: value });
    else if (id === "username")
      setPersonalInfo({ ...personalInfo, username: value });
    else if (id === "name") setPersonalInfo({ ...personalInfo, name: value });
  };

  const handleUpdate = async () => {
    if (
      !personalInfo.name ||
      !personalInfo.email ||
      !personalInfo.mobile ||
      !personalInfo.username ||
      !personalInfo.gender
    ) {
      return alert("please fill the empty fields");
    }
    try {
      const response = await axios.post(
        `${URI}/profile/update/${updateId}`,
        personalInfo
      );
      if (response.status === 200 || response.status === 201) {
        alert("Details updated successfully");
        setPersonalInfo(personalInfo);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleNavigate = () => {
    navigate(`/deliveryaddress/?username=${updateId}`);
  };

  const handlePasswordReset = () => {
    setReset(true);
  };
  const handlePasswordCheck = async () => {
    try {
        const response = await axios.get(
            `${URI}/auth/resetpassword/check/?password=${password}`,
            { withCredentials: true }  // Ensure cookies are sent
        );
        if(response.status===200 || response.status ===201){
          setPasswordSuccess(!passwordSuccess);
          setPassword("");
          setReset(!reset);
        }
    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
        alert(err.response.data.message)
    }
};
  const handlePasswordUpdate = async () => {
    try {
        const response = await axios.put(
            `${URI}/auth/resetpassword/update/?newpassword=${newPassword}`,
            { withCredentials: true }  // Ensure cookies are sent
        );
        console.log(response);
        if(response.status===200 || response.status ===201){
          console.log(response);
          setPasswordSuccess(!passwordSuccess);
          setNewPassword("")
        }
    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
        alert(err.response.data.message)
    }
};

  return (
    <div className="relative h-screen w-screen">
      <header className="relative h-[15%]  w-full bg-blue-300 ">
        <div className="h-[25%] w-full bg-pink-300 xsm:text-sm flex items-center justify-center">
          10% Discount on first purchase | Welcome
        </div>
        <div className=" h-[75%] w-full bg-yellow-300 flex ">
          <div className="h-full w-[30%] bg-pink-300 shrink-0">
            <img src={uandiLogo} alt="dsvd" className="h-full w-full" />
          </div>
          <div className="h-full w-[70%]  shrink-0">
            <CgProfile className=" absolute text-3xl right-4 top-1/2" />
            <Link to="/cart">
              <MdOutlineShoppingCart className="absolute text-3xl right-16 top-1/2" />
            </Link>
          </div>

          <div className="w-[70%] "></div>
        </div>
      </header>
      <main className="relative h-[85%] w-full overflow-y-auto overflow-x-hidden mb-8">
        <div className="h-[30%] w-full p-2 flex flex-wrap items-center justify-around gap-2">
          <div className="border-2 border-gray-300 h-[40%] w-[40%] p-2 rounded flex items-center justify-center gap-2"
          onClick={()=>{navigate('/whishlist')}}
          >
            <GoHeart /> Whishlist
          </div>
          <div className="border-2 border-gray-300 h-[40%] w-[40%] p-2 rounded flex items-center justify-center gap-2"
          onClick={()=>{navigate('/userorders')}}
          >
            <FaBorderAll /> Orders
          </div>
        </div>

        <form className="px-4 flex flex-col gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm">Mobile Number</label>
            <div className="border-b-2 border-gray-300 flex items-center justify-between">
              <input
                type="number"
                id="mobile"
                value={personalInfo.mobile}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="outline-none"
              />
              <div className="text-blue-500" onClick={handleUpdate}>
                update
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm">E-mail</label>
            <div className="border-b-2 border-gray-300 flex items-center justify-between">
              <input
                type="text"
                id="email"
                value={personalInfo.email}
                onChange={handleChange}
                className="outline-none"
              />
              <div className="text-blue-500" onClick={handleUpdate}>
                update
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm">User Name</label>
            <div className="border-b-2 border-gray-300 flex items-center justify-between">
              <input
                type="text"
                id="username"
                value={personalInfo.username}
                onChange={handleChange}
                className="outline-none"
              />
              <div className="text-blue-500" onClick={handleUpdate}>
                update
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm">Name</label>
            <div className="border-b-2 border-gray-300 flex items-center justify-between">
              <input
                type="text"
                id="name"
                value={personalInfo.name}
                onChange={handleChange}
                className="outline-none"
              />
              <div
                className="text-blue-500 cursor-pointer"
                onClick={handleUpdate}
              >
                update
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm">Gender</label>
            <div className="border-b-2 border-gray-300 flex items-center justify-between">
              <select
                id="gender"
                value={personalInfo.gender} // This binds the selected value to the state
                onChange={handleChange} // Update the state on change
                className="outline-none"
              >
                <option value="">Select Gender</option>{" "}
                {/* Empty value for placeholder */}
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
              </select>

              <div
                className="text-blue-500 cursor-pointer"
                onClick={handleUpdate}
              >
                update
              </div>
            </div>
          </div>
        </form>

        <div className="max-h-max w-full p-2 flex flex-col gap-4">
          <div
            className="flex items-center justify-between"
            onClick={handleNavigate}
          >
            Delivery Address <MdOutlineKeyboardArrowRight />
          </div>
          <hr />
        </div>
        <div className="max-h-max w-full p-2 mb-4 flex flex-col gap-4">
          <div
            className="flex items-center justify-between"
            onClick={handlePasswordReset}
          >
            Password Reset <MdOutlineKeyboardArrowRight />
          </div>
          <hr />
        </div>
        {reset && (
          <div className="absolute top-0 left-0 h-screen w-screen flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Reset Password</h2>
              <input
                type="password"
                placeholder="Enter Your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="border border-gray-300 p-2 rounded"
              />
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() =>{
                    setPassword("");
                     setReset(false)
                    }} // Close the popup
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handlePasswordCheck} // Submit password
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
        {passwordSuccess && (
          <div className="absolute top-0 left-0 h-screen w-screen flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] flex flex-col gap-4">
              <h2 className="text-lg font-semibold">New Password</h2>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                className="border border-gray-300 p-2 rounded"
              />
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setNewPassword("")
                    setPasswordSuccess(false)
                  }} // Close the popup
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handlePasswordUpdate} // Submit password
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
