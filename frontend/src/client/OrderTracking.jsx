import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
import uandiLogo from "../assets/uandilogo.jpg";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaStar } from "react-icons/fa6";
import { FaChevronRight, FaCheck } from "react-icons/fa";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { useRef } from "react";
import { TbBookUpload } from "react-icons/tb";
import { MdDelete } from "react-icons/md";



const OrderTracking = () => {
  const URI = "http://localhost:5000";
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const [order, setOrder] = useState(null);
  const [productId,setProductId] = useState();
  const [selectedRating, setSelectedRating] = useState([]); // Store selected rating
  const [review,setReview] = useState("");
  const [hover, setHover] = useState([]);
  const { orderId } = useParams(); // Get orderId from URL
  const imageRef = useRef(null);
  const [images, setImages] = useState([]);
  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get(`${URI}/placeOrder/orderDetails`, {
          params: {
            orderId: orderId, // If orderId is empty, send an empty string
          },
        });
  
        if (response.status === 200 || response.status === 201) {
          setOrder(response.data.filteredOrder);
  
          const productDetails = response.data.filteredOrder.productDetails;
          if (productDetails.length > 0) {
            // Collect all ratings in a temporary array
            const ratings = productDetails.map((product) => product.review.stars);  
            setSelectedRating(ratings);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    getOrders();
  }, []); // Make sure this useEffect only runs once
  
  console.log(selectedRating);
  
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
      console.log("kiyfiy")
      if (order && order.orderId === orderId) {
        setOrder((prevOrder) => ({
          ...prevOrder,
          status: newStatus,
        }));
      }
    });

    return () => {
      socketInstance.disconnect();
    };
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

  const handlereview = async(rating, index,Id) => {
    const updated = [...selectedRating];
    updated[index] = rating;
    setSelectedRating(updated);
    try{
      const config = { headers: { "Content-Type": "application/json" } };
      const response = await axios.post(`${URI}/auth/review`,{'rating' : rating,'orderId' : order.orderId, 'productId' : Id },config);
      if(response.status===200){
        alert("rated successfully");
      }
    }
    catch(err){
      console.log(err);

    }
  };
  // Ensure order is defined before accessing its properties
  const steps = order ? getTrackingSteps(order.status) : [];
  const currentStep = order ? getStepIndex(order.status) : 0;

  const handleImageUpload = (e) => {
    let files = Array.from(e.target.files);
    if (files.length > 0) {
      const imageUrls = files.map((file) => URL.createObjectURL(file));
        setImages([...images, ...imageUrls]);      
    }
  };


  const handleDel = (index) => {
   
      const filteredimages = images.filter((_, ind) => ind !== index);
      setImages(filteredimages);
  }
  const handleReviewSumbission = async()=>{
    if(!review){
      alert("please write something")
    }
    console.log(productId)
    const formData = new FormData();
    formData.append("review", review);
    formData.append("orderId", order.orderId);
    formData.append("productId", productId);
    Array.from(imageRef.current.files).forEach((file) =>
      formData.append("images", file)
    );
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await axios.post(`${URI}/auth/review`, formData, config);
      
      // Clear form fields after success
      if(response.status===200 || response.status===201){
        setReview("");
        setImages([]);
        alert("Review added successfully");
      }
    } catch (err) {
      // Check if the error message is related to the file format
      if (err.response && err.response.status === 400 && err.response.data.error === 'Give proper file format to upload') {
        alert('Give proper file format to upload');
      } else {
        console.log("Error adding product:", err);
        alert('An error occurred while adding the product');
      }
    }
  }
  return (
    <div className="relative h-screen w-full">
      <header className="relative h-[15%] w-full bg-blue-300">
        <div className="h-[25%] w-full bg-pink-300 xsm:text-sm flex items-center justify-center">
          10% Discount on first purchase | Welcome
        </div>
        <div className="h-[75%] w-full bg-yellow-300 flex">
          <div className="h-full w-[30%] bg-pink-300 shrink-0">
            <img src={uandiLogo} alt="U&I Logo" className="h-full w-full" />
          </div>
          <div className="h-full w-[70%] shrink-0 relative">
            <CgProfile className="absolute text-3xl right-4 top-1/2" />
            <Link to="/cart">
              <MdOutlineShoppingCart className="absolute text-3xl right-16 top-1/2" />
            </Link>
          </div>
        </div>
      </header>
      <div className="w-full bg-gray-100 py-8 flex justify-center items-center">
        <div className="flex justify-between items-center w-[80%] max-w-[1024px] relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-[25%] relative"
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
      </div>

      <main className="relative h-[75%] w-full flex justify-center items-center overflow-y-auto p-4">
        <div className="h-full overflow-y-auto">
          {order && order.productDetails && order.productDetails.length > 0 ? (
            order.productDetails.map((productItem, index) => (
              <>
                <div
                  className=" w-full aspect-[4/1] mt-6 flex gap-2 items-center bg-white shadow-md rounded-lg p-4"
                  key={productItem._id}
                >
                  <img
                    src={`data:image/png;base64,${
                      productItem.product.images?.length > 0
                        ? productItem.product.images[0]
                        : "default_image_url"
                    }`}
                    alt={productItem.product.name}
                    className="relative w-[25%] aspect-[1/1] object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="xsm:text-sm mb-2 font-semibold text-gray-800">
                      {productItem.product.name.length > 20
                        ? `${productItem.product.name.slice(0, 20)}...`
                        : productItem.product.name}
                    </div>
                    <div className="flex item-center justify-left xsm:text-sm mb-2 text-gray-700">
                      {productItem.product.price}{" "}
                      {"offer" + productItem.product.offer}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      Selected Size: {productItem.selectedSize}
                    </div>
                    <div className="flex gap-2 text-xs text-green-500">
                      <div>Arriving Tomorrow</div>
                    </div>
                  </div>
                </div>
                {order.status.toLowerCase() === "delivered" && (
                  <div className="flex gap-4 items-center mt-4">
                    <div className="flex gap-1 items-center" key={index}>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <FaStar
                          key={rating}
                          className={`text-xl text-gray-700 ${
                            (selectedRating.length > index && selectedRating[index] >= rating) ||
                            hover[index] >= rating
                              ? "text-yellow-500"
                              : "text-gray-500"
                          } cursor-pointer border-2 border-transparent`}
                          onClick={() => {
                            handlereview(rating, index,productItem.product.id); // Handle review submission
                          }}
                          onMouseEnter={() => {
                            const updated = [...selectedRating];
                            updated[index] = rating;
                            setHover(updated); // Set hover state
                          }}
                          onMouseLeave={() => {
                            setHover(selectedRating); // Reset hover state on mouse leave
                          }}
                        />
                      ))}
                    </div>
                    <div
                      className="text-sm text-gray-700 flex items-center cursor-pointer"
                      onClick={() => {
                        setProductId( productItem.product.id)
                        setPopup(!popup);
                      }}
                    >
                      Write a review
                    </div>
                  </div>
                )}
              </>
            ))
          ) : (
            <div className="text-center">Loading order details...</div>
          )}
        </div>

        {popup && (
          <div className="absolute z-50 w-[90%] max-w-lg aspect-[4/3] backdrop-blur-xl rounded-lg border-2 border-blue-500 bg-white flex flex-col items-center p-4 shadow-lg">
            <div className="flex mb-2 justify-end w-full">
              <RxCross2
                onClick={() => {
                  setPopup(!popup);
                }}
              />
            </div>
            <h2 className="text-lg font-semibold mb-2">Write Your Review</h2>
            <textarea
              className="border-2 w-full h-32 border-gray-300 overflow-y-auto rounded-lg p-2 resize-none mb-4"
              placeholder="Write your review here..."
              value={review}
              onChange={(e)=>{
                console.log(e.target.value)
                setReview(e.target.value)
              }}
            />
            <div className="flex p-2 h-24 w-full border-2 border-gray-300 rounded">
              <input
                type="file"
                multiple
                id="image"
                name="Image"
                ref={imageRef}
                className="opacity-0 ml-hidebuttons "
                onChange={(e)=>{handleImageUpload(e)}}
              />
              <TbBookUpload
                id="image"
                className="h-[100%] w-[10%] cursor-pointer"
                onClick={()=>{imageRef.current.click();}}
              />
              <div className="flex h-[100%] w-[90%] overflow-x-auto">
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <div className=" relative h-[100%] w-[35%] rounded ml-2 shrink-0 ">
                      <img
                        key={index}
                        src={image}
                        alt={`Uploaded ${index}`}
                        className="h-full w-full rounded"
                      />
                      <MdDelete
                        id="image"
                        className="absolute right-1 top-1 text-red-600 text-lg"
                        onClick={() => {handleDel(index)}}
                      />
                    </div>
                  ))
                ) : (
                  <p>No images uploaded</p>
                )}
              </div>
            </div>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={()=>{handleReviewSumbission()}}
            >
              Submit
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderTracking;
