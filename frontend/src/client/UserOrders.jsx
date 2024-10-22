import React, { useState, useEffect } from "react";
import axios from "axios";
import uandiLogo from "../assets/uandilogo.jpg";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserOrders = () => {
    const URI = "http://localhost:5000";

    const [orderDetails,setOrderDetails] = useState();
    const navigate = useNavigate();
    
    useEffect(()=>{
        const getOrders = async()=>{
            try{
                const response = await axios.get(`${URI}/placeOrder/orderDetails`)
                if(response.status===200 || response.status===201){
                  console.log(response)
                    setOrderDetails(response.data.orders)
                }
            }
            catch(err){

            }
        }
        getOrders()
    },[])

  return (<div className="relative h-screen w-full">
    <header className="relative h-[15%] w-full bg-blue-300">
      <div className="h-[25%] w-full bg-pink-300 xsm:text-sm flex items-center justify-center">
        10% Discount on first purchase | Welcome
      </div>
      <div className="h-[75%] w-full bg-yellow-300 flex">
        <div className="h-full w-[30%] bg-pink-300 shrink-0">
          <img src={uandiLogo} alt="dsvd" className="h-full w-full" />
        </div>
        <div className="h-full w-[70%] shrink-0">
          <CgProfile className="absolute text-3xl right-4 top-1/2" />
          <Link to="/cart">
            <MdOutlineShoppingCart className="absolute text-3xl right-16 top-1/2" />
          </Link>
        </div>
      </div>
    </header>
  
    <main className="absolute h-[85%] w-full overflow-y-auto overflow-x-auto mb-8 p-2">
    <div className="h-[100%] overflow-y-auto"> {/* Container div for background color */}
  {orderDetails && orderDetails.length > 0 ? (
    orderDetails.map((order) => (
      <div key={order._id} > {/* Key for each order */}
        {order.productDetails.map((product) => (
          <div
            className="relative w-full aspect-[4/1] mb-4 flex gap-2 items-center" // Added items-center to vertically center
            key={`${order.orderId}-${product._id}`} // Composite key
            onClick={()=> {navigate(`/ordertracking/${order.orderId}`)}}
          >
            {/* Ensure to provide a valid image URL */}
            <img
              src={`data:image/png;base64,${product.product.images && product.product.images.length > 0 ? product.product.images[0] : 'default_image_url'}`} 
              alt={product.product.name}
              className="relative w-[25%] aspect-[1/1] object-cover rounded"
            />
            <div className="flex-1"> {/* Allow this div to take the available space */}
              <div className="text-base mb-2">
                {(product.product.name).length > 20 ? (product.product.name).slice(0, 20) + "..." : product.product.name}
              </div>
              <div className="text-xs text-gray-500 mb-2">{product.selectedSize} {product.selectedSize}</div> 
              {/* <div className="text-xs text-gray-500 mb-2"></div>  */}
              <div className="text-xs text-green-500">Arriving Tomorrow</div>
            </div>
            <div className="flex-shrink-0"> {/* Prevent shrinking to keep the arrow visible */}
              <FaChevronRight />
            </div>
          </div>
        ))}
      </div>
    ))
  ) : (
    <div>No orders available.</div> // User-friendly message
  )}
</div>



    </main>
  </div>
  
  )
}

export default UserOrders
