import uandiLogo from "../assets/uandilogo.jpg";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

const DeliveryAddress = ({handleAddAddress}) => {
  const [addresses, setAddresses] = useState([]);

  const URI = "http://localhost:5000";

 

  useEffect(() => {
    const getAddress = async () => {
      try {
        const response = await axios.get(`${URI}/getAddress`);
        setAddresses(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    getAddress()

  }, []);

  const handleDeleteAddress = async(index)=>{
    const delId = (addresses[index]._id) ;
    console.log(delId);
      try{
      const response = await axios.delete(`${URI}/delete/address`, {data:{delId}});
      if(response.status === 200 || response.status === 201 ){
        const updatedAddresses = addresses.filter((_, idx) => idx !== index);
        setAddresses(updatedAddresses);
      }
      }
      catch(err){
        console.log(err)
      }
    } 

  return (
    <div className="h-screen w-screen">
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
      <main className=" h-[85%] w-full  overflow-y-auto ">
        <div className="relative h-16 w-full flex items-center">
          <button
            id="addAddress"
            className=" absolute right-4 border-2 rounded bg-blue-500 text-white p-2 "
            onClick={(e)=>{handleAddAddress(e,"","deliveryaddress")}}
          >
            Add address
          </button>          
        </div>
        {addresses.length > 0 ? (
            addresses.map((address,index) => (
              <div key={index} className="max-h-max w-[90%] mx-auto p-2 border-2 border-gray-400 my-4">
                <div className="flex justify-between items-center words-break">
                  <button                  
                    id="changeAddress"
                    onClick={(e)=>{handleAddAddress(e,index,"deliveryaddress")}}
                    className="border-2 border-gray-300 bg-yellow-500 min-w-max max-h-max p-2 text-white text-sm font-bold rounded "
                  >
                    Change
                  </button>
                    <MdDelete 
                    id="deleteAddress"
                      onClick={()=>{handleDeleteAddress(index)}}
                      className=" text-red-600 text-2xl font-bold rounded "
                    />
                </div>
                <div className="flex justify-between font-semibold mt-4">
                  <div>{address.name}</div>
                  <div className="flex items-center ">
                    {address.adressType === "Home" ? (
                      <CiHome />
                    ) : address.adressType === "work" ? (
                      <MdWorkOutline />
                    ) : (
                      ""
                    )}
                    {address.adressType}
                  </div>
                </div>
                <div className="mt-2">
                  {address.address} {address.locality} {address.landmark}{" "}
                  {address.city}
                  {"-"}
                  {address.pincode}
                </div>
                <div className="max-h-max min-w-max mt-2 font-bold">
                  {address.mobile}
                </div>
              </div>
            ))
          ) : (
            <div className="relative m-auto text-xl text-gray-500 h-full w-full flex items-center justify-center"> Please add address </div>
          )}
      </main>
    </div>
  );
};

export default DeliveryAddress;
