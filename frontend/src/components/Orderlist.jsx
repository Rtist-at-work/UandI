import axios from "axios";
import React, { useState, useEffect } from "react";
import Footer from "./mobile components/Footer";

const Orderlist = () => {
  const URI = "http://localhost:5000";
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${URI}/admin/orders`);
      setOrders(response.data.order); // Assuming response.data contains the orders
    } catch (err) {
      console.log(err);
    }
  };
  const handleStatusChange = (value,orderId,userId)=>{
    const data = {
      value : value,
      orderId : orderId,
      userId:userId
    }
  try{
    const response = axios.put(`${URI}/admin/orders/orderstatus`,data)
    console.log(response);

  }
  catch(err){
    console.log(err)
  }    
  }
  return (
    <div className="absolute  h-[93%] w-full  bg-white-800 ">
      <main className="grid xsm:grid-rows-3 p-1 overflow-y-auto h-[95%] w-full">
        <div className="container mx-auto p-4 md:p-6 w-full">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Order Management
          </h1>
          <div className="overflow-x-auto max-w-full">
            <table className="max-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-xs md:text-base">
                  <th className="text-left px-4 py-3 min-w-[120px]">
                    Order ID
                  </th>
                  <th className="text-left px-4 py-3 min-w-[120px]">Date</th>
                  <th className="text-left px-4 py-3 min-w-[200px]">
                    Products
                  </th>
                  <th className="text-left px-4 py-3 min-w-[100px]">Price</th>
                  <th className="text-left px-4 py-3 min-w-[150px]">
                    Payment Method
                  </th>
                  <th className="text-left px-4 py-3 min-w-[200px]">
                    Delivery Address
                  </th>
                  <th className="text-left px-4 py-3 min-w-[120px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="border-t text-xs md:text-base"
                    >
                      <td className="px-4 py-4 truncate">{order.orderId}</td>
                      <td className="px-4 py-4 truncate">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        {order.product.map((product, idx) => (
                          <div key={idx} className="mb-1 truncate">
                            <span className="font-semibold">
                              {product.product.name}
                            </span>{" "}
                            - {product.count} pcs
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-4 truncate">{order.price}</td>
                      <td className="px-4 py-4 truncate">
                        {order.coupon || "N/A"}
                      </td>
                      <td className="px-4 py-4 truncate">
                        {order.deliveryaddress.city}{" "}
                        {order.deliveryaddress.pincode}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          className="py-1 px-2 md:px-3 rounded-full text-xs md:text-sm border border-gray-300 bg-white"
                          value={order.status} // Set default value as order.status
                          onChange={(e) =>
                            handleStatusChange(e.target.value, order.orderId,order.userId)
                          } // Handle status change
                        >
                          <option
                            value="orderPlaced"
                            selected={order.status === "orderPlaced"}
                          >
                            Order Placed
                          </option>
                          <option
                            value="confirm"
                            selected={order.status === "confirm"}
                          >
                            Confirm
                          </option>
                          <option
                            value="shipped"
                            selected={order.status === "shipped"}
                          >
                            Shipped
                          </option>
                          <option
                            value="delivered"
                            selected={order.status === "delivered"}
                          >
                            Delivered
                          </option>
                          <option
                            value="cancelled"
                            selected={order.status === "cancelled"}
                          >
                            Cancelled
                          </option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <footer className="relative bottom-0gap-2 p-2  h-[5%] bg-gray-100 lg:hidden ">
        <Footer />
      </footer>
    </div>
  );
};

export default Orderlist;
