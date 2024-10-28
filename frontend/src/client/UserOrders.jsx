import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronRight, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { FaStar } from "react-icons/fa6";
import Header from "./Header";

const UserOrders = () => {
  const URI = "http://localhost:5000";
  const [orderDetails, setOrderDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const socketInstance = io(URI, {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log(`Socket connected: ${socketInstance.id}`);
    });

    socketInstance.on("auth_error", (data) => {
      alert(data.message);
      navigate("/login");
    });

    socketInstance.on("orderStatusUpdated", ({ orderId, newStatus }) => {
      if (orderDetails) {
        // Use find instead of filter to get a single object
        let order = orderDetails.find((order) => order.orderId === orderId);

        if (order) {
          // Update the status of the found order
          order.status = newStatus;

          // Update the state with the modified orderDetails array
          setOrderDetails((prevOrders) =>
            prevOrders.map((prevOrder) =>
              prevOrder.orderId === orderId
                ? { ...prevOrder, status: newStatus }
                : prevOrder
            )
          );
        }
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get(`${URI}/placeOrder/orderDetails`);
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          setOrderDetails(response.data.orders);
        }
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };
    getOrders();
  }, []);

  const getTrackingSteps = (status) => {
    if (status.toLowerCase() === "cancelled") {
      return ["Order Placed", "Cancelled"];
    }
    return ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];
  };

  const getStepIndex = (status) => {
    switch (status.toLowerCase()) {
      case "order placed":
        return 0;
      case "shipped":
        return 1;
      case "out for delivery":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
        return 1;
      default:
        return 0;
    }
  };
  console.log(orderDetails);

  return (
    <div className="relative h-screen w-full scrollbar-hidden">
      <Header />
      <main className="absolute h-[85%] w-full overflow-y-auto overflow-x-auto mb-8 md:p-2 scrollbar-hidden xsm:p-4">
        <h1 className="md:ml-8 xxsm:w-[90%] md:w-[80%] md:p-4 xsm:py-4 font-semibold md:text-xl xsm:text-base">
          YOUR ORDERS
        </h1>
        {orderDetails.length > 0 ? (
          orderDetails.map((order) => {
            const steps = getTrackingSteps(order.status);
            const currentStep = getStepIndex(order.status);

            return (
              <div key={order._id}>
  {order.productDetails && order.productDetails.map((product) => (
    <div
      className="relative flex items-center justify-between xxsm:w-[90%] cursor-pointer md:w-[80%] mx-auto shadow-md p-2 mb-8 rounded"
      key={`${order.orderId}-${product._id}`}
      onClick={() => navigate(`/ordertracking/${order.orderId}`)}
    >
      <img
        src={`data:image/png;base64,${
          product.product?.images?.[0] || "default_image_url"
        }`}
        alt={product.product?.name || "Image not available"}
        className="sm:w-32 xsm:w-24 xsm:h-24 sm:h-32 aspect-square object-cover mr-4"
      />
      <div className="flex-1 lg:w-[30%] md:w-[40%] xsm:w-full">
        <div className="xsm:text-xsm md:text-base font-semibold mb-2">
          {product.product?.name
            ? product.product.name.length > 20
              ? product.product.name.slice(0, 20) + "..."
              : product.product.name
            : "Name not available"}
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {product.selectedSize || "Size not specified"}
        </div>
        <div className="mb-2 font-semibold">
          ₹ {product.product?.price || "Price not available"}
        </div>
        <div className="text-xs text-green-500">
          Arriving Tomorrow
        </div>
      </div>

      {order.status.toLowerCase() !== "delivered" && order.status.toLowerCase() !== "cancelled" ? (
        <div className="md:flex justify-between items-center lg:w-[70%] md:w-[60%] relative hidden">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col justify-start items-center w-[25%] relative"
            >
              <div
                className={`w-[40px] h-[40px] xsm:w-[30px] xsm:h-[30px] aspect-[1/1] rounded-full flex items-center justify-center text-white transition-colors duration-300 ${
                  index <= currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {index < currentStep ? (
                  <FaCheck className="text-lg" />
                ) : (
                  index + 1
                )}
              </div>
              <p
                className={`text-sm mt-2 xsm:text-xs xsm:mt-3 ${
                  index <= currentStep ? "text-green-500" : "text-gray-400"
                }`}
              >
                {step}
              </p>
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-1/2 left-full h-1 w-[100%] transition-all duration-300 ${
                    index < currentStep ? "bg-green-500" : "bg-gray-300"
                  }`}
                  style={{ transform: "translateX(-50%)" }}
                ></div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="md:flex flex-col justify-center gap-2 hidden mx-autolg:w-[70%] md:w-[60%] relative">
          <div className="flex justify-center items-center gap-2">
            <div
              className={`h-4 w-4 rounded-full ${
                order.status.toLowerCase() === "delivered"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
            <p
              className={`text-sm ${
                order.status.toLowerCase() === "delivered"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {order.status} on delivery date
            </p>
          </div>
          <p className="text-gray-500 text-sm mx-auto">
            Item has been delivered on delivery date
          </p>
          <p className="text-sm text-blue-500 flex items-center gap-2 mx-auto hover:text-green-500">
            <FaStar className="xsm:h-6 xsm:w-6 md:h-2 xsm:w-2 text-blue-500 hover:text-green-500" /> 
            Rate & Review Product
          </p>
        </div>
      )}
      <div className="flex-shrink-0">
        <FaChevronRight />
      </div>
    </div>
  ))}
</div>

            );
          })
        ) : (
          <div>No orders available.</div>
        )}
      </main>
    </div>
  );
};

export default UserOrders;
