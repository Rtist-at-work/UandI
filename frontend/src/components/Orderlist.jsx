import axios from "axios";
import Footer from "./mobile components/Footer";
import { io } from "socket.io-client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orderlist = () => {
  const URI = "http://localhost:5000";
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [socketInstance, setSocketInstance] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("orderPlaced"); // Default status
  const navigate = useNavigate();
  useEffect(() => {
    const socketInstance = io(URI, {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log(`Socket connected: ${socketInstance.id}`);
    });

    socketInstance.on("auth_error", (data) => {
      alert(data.message); // Example action
      navigate("/login"); // Redirect to login page or another action
    });

    setSocketInstance(socketInstance);
    fetchOrders();

    return () => {
      socketInstance.disconnect();
    };
  }, []); // Empty dependency array to run once on mount

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${URI}/admin/orders`);
      console.log(response);
      setOrders(response.data.orders); // Assuming response.data contains the orders
      const filtered = response.data.orders.filter(
        (order) => order.status === "orderplaced" || order.status === "orderPlaced"
      );
      
      console.log(filtered)
      setFilteredOrders(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  // Function to filter orders based on selected status
  const filterOrdersByStatus = (status) => {
    setSelectedStatus(status);
    const filtered = orders.filter((order) => order.status === status);
    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (value, orderId, userId, index) => {
    console.log(userId);
    const data = {
      value: value,
      orderId: orderId,
      userId: userId,
    };

    try {
      if (socketInstance.connected) {
        // Emit the event to update order status
        socketInstance.emit("orderStatusUpdation", data);

        // Listen for success response
        socketInstance.on("status_update_success", (response) => {
          let updatedOrder = [...orders];
          updatedOrder[index].status = response.value;
          setOrders(updatedOrder);
          filterOrdersByStatus(selectedStatus); // Re-filter based on current status
        });

        // Listen for error response
        socketInstance.on("status_update_error", (error) => {
          console.error("Error updating order status:", error.message);
        });
      } else {
        console.log("Socket not connected.");
      }
    } catch (err) {
      console.log("Error in handleStatusChange:", err);
    }
  };

  return (
    <div className="absolute h-[90%] w-full bg-white-800 rounded-md shadow-md">
      <main className="p-1 overflow-y-auto xsm:h-[95%] md:h-full w-full scrollbar-hidden">
        <div className="max-h-max w-full bg-pink-300 flex gap-4 overflow-x-auto items-center justify-around p-2 ">
          <div
            className={`max-h-max w-auto text-sm lg:w-[15%] hover:shadow-md rounded-s-full rounded-e-full cursor-pointer hover:bg-blue-500 hover:text-white  ${
              selectedStatus === "orderPlaced"
                ? "bg-blue-500 text-white"
                : " bg-gray-300 text-gray-700"
            } font-semibold flex-shrink-0 px-4 py-2 flex items-center justify-center whitespace-nowrap`}
            onClick={() => filterOrdersByStatus("orderplaced")}
          >
            Order Placed
          </div>
          <div
            className={`max-h-max w-auto text-sm lg:w-[15%] hover:shadow-md flex-shrink-0 px-4 py-2  hover:bg-blue-500 hover:text-white  rounded-s-full rounded-e-full cursor-pointer ${
              selectedStatus === "shipped"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            } font-semibold flex items-center justify-center whitespace-nowrap`}
            onClick={() => filterOrdersByStatus("shipped")}
          >
            Shipped
          </div>
          <div
            className={`max-h-max w-auto text-sm lg:w-[15%] hover:shadow-md flex-shrink-0 px-4 py-2  hover:bg-blue-500 hover:text-white  rounded-s-full rounded-e-full cursor-pointer ${
              selectedStatus === "out for delivery"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            } font-semibold flex items-center justify-center whitespace-nowrap`}
            onClick={() => filterOrdersByStatus("out for delivery")}
          >
            Out for delivery
          </div>
          <div
            className={`max-h-max w-auto text-sm lg:w-[15%] hover:shadow-md flex-shrink-0 px-4 py-2  hover:bg-blue-500 hover:text-white  rounded-s-full rounded-e-full cursor-pointer ${
              selectedStatus === "delivered"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            } font-semibold flex items-center justify-center whitespace-nowrap`}
            onClick={() => filterOrdersByStatus("delivered")}
          >
            Delivered
          </div>
          <div
            className={`max-h-max w-auto text-sm lg:w-[15%] hover:shadow-md flex-shrink-0 px-4 py-2  hover:bg-blue-500 hover:text-white  rounded-s-full rounded-e-full cursor-pointer ${
              selectedStatus === "cancelled"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            } font-semibold flex items-center justify-center whitespace-nowrap`}
            onClick={() => filterOrdersByStatus("cancelled")}
          >
            Cancelled
          </div>
        </div>
        <div className="w-full h-full p-2 ">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full max-h-max bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-xs md:text-base">
                  <th className="text-left px-4 py-3 bg-green-200 min-w-[100px]">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 bg-blue-200 min-w-[100px]">
                    Order ID
                  </th>
                  <th className="text-left px-4 py-3 bg-pink-200 min-w-[200px]">
                    Products
                  </th>
                  <th className="text-left px-4 py-3 bg-blue-200 min-w-[100px]">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 bg-green-200 min-w-[150px]">
                    Payment Method
                  </th>
                  <th className="text-left px-4 py-3 bg-yellow-300 min-w-[200px]">
                    Delivery Address
                  </th>
                  <th className="text-left px-4 py-3 bg-pink-300 min-w-[100px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders && filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <tr
                      key={order.orderId}
                      className="border-t text-xs md:text-base"
                    >
                      <td className="px-4 py-4 truncate">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 truncate">{order.orderId}</td>

                      <td className="px-4 py-4">
                        {order.product.map((product, idx) => (
                          <div key={idx} className="mb-1 truncate">
                            <span className="font-semibold">
                              {product.product.name||"Details not available"}
                            </span><br></br>
                            <span className="text-xs text-gray-500">
                            [{product.selectedSize},color]
                            </span>{" "}
                            {' '}- {product.count} pcs
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-4 truncate">{order.price}</td>
                      <td className="px-4 py-4 truncate">
                        {order.paymentMethod || "N/A"}
                      </td>
                      <td className="px-4 py-4 truncate">
                        {order.deliveryaddress.address}<br></br>
                        {order.deliveryaddress.addressType}{" "}
                        {order.deliveryaddress.landmark}{" "}
                        {order.deliveryaddress.locality}{" "}
                        {order.deliveryaddress.city}-{" "}
                        {order.deliveryaddress.pincode}<br></br>
                        {order.deliveryaddress.state}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          className="py-1 px-2 md:px-3 rounded-full text-xs md:text-sm border border-gray-300 bg-white"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              e.target.value,
                              order.orderId,
                              order.userId,
                              index
                            )
                          }
                        >
                          <option value="orderPlaced">Order Placed</option>
                          <option value="shipped">Shipped</option>
                          <option value="out for delivery">
                            Out for delivery
                          </option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
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
      <footer className="h-[5%] w-full md:hidden xsm:block">
        <Footer />
      </footer>
    </div>
  );
};

export default Orderlist;
