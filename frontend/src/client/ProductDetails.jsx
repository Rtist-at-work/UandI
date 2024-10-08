import React, { useState } from "react";
import uandiLogo from "../assets/uandilogo.jpg";
import { CgProfile } from "react-icons/cg";
import { MdOutlineShoppingCart } from "react-icons/md";
import Footer from "./Footer";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ProductDetails = ({
  handleCart,
  handleWhishlist
}) => {
  const [index,setIndex] = useState(0);
  const [isDescription, setIsDescription] = useState(false);
  const [isProductDetails, setIsProductDetails] = useState(false);
  const [isReturnPolicy, setIsReturnPolicy] = useState(false);
  const location = useLocation();
  const [productDetails, setProductDetails] = useState(location.state?.product);
  const [selectedSize,setSelectedSize] = useState();

  
  

  const toggleAnswer = (e) => {
    const { id } = e.target;
    if (id === "description") setIsDescription(!isDescription);
    if (id === "productdetails") setIsProductDetails(!isProductDetails);
    if (id === "returnpolicy") setIsReturnPolicy(!isReturnPolicy);
  };


 

  return (
    <div className="h-screen w-screen relative">
      <header className="relative h-[15%] w-full blue">
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
          <div className="w-[70%]"></div>
        </div>
      </header>
      <main className="h-[85%] w-full flex flex-col gap-2 overflow-y-scroll scrollbar-hidden p-4">
        <div className="h-[50%] w-full bg-yellow-300 shrink-0">
          {productDetails &&
          productDetails.images &&
          productDetails.images.length > 0 ? (
            <img
              src={`data:image/png;base64,${productDetails.images[index]}`}
              className="h-full w-full"
              alt="Product"
            />
          ) : (
            <p>Image not available</p>
          )}
        </div>
        <div className=" max-h-max w-full  flex flex-shrink-0 gap-1 overflow-auto scrollbar-hidden ">
          {productDetails &&
          productDetails.images &&
          productDetails.images.length > 0 ? productDetails.images.map((image,index)=>(
             <img key={index} src={`data:image/png;base64,${image}`} alt="img" className="relative h-12 w-12 rounded-md p-1 "
             onClick={()=>{
              setIndex(index);
             }}
             />
          )) : ''

          }
        </div>
        <div className="max-h-max w-full flex flex-col gap-2 break-words">
          <h1>{productDetails?.name || "Product Name"}</h1>
          <h1>{productDetails?.price || "Product Price"}</h1>
        </div>

        <div className="max-h-max w-full border-2 border-gray-300 p-2">
          <div className="h-8 w-full flex items-center">
            <h1 id="description" onClick={toggleAnswer}>
              Description
            </h1>
          </div>
          {isDescription && (
            <div className="w-full">
              {productDetails?.description || "No description available"}
            </div>
          )}
          <hr />
          <div className="h-8 w-full flex items-center">
            <h1 id="productdetails" onClick={toggleAnswer}>
              Product Details
            </h1>
          </div>
          {isProductDetails && (
            <div className="w-full">Details not available</div>
          )}
          <hr />
          <div className="h-8 w-full flex items-center">
            <h1 id="returnpolicy" onClick={toggleAnswer}>
              Return Policy
            </h1>
          </div>
          {isReturnPolicy && (
            <div className="w-full">Policy details not available</div>
          )}
        </div>
        <div className="max-h-max w-full">
          <h1 className="my-4">Size</h1>
          <div className="flex flex-wrap gap-2">
            {productDetails ? (
              productDetails.sizes.map((size) => (
                <div
                  key={size}
                  id={size}
                  className={`border-2 border-gray-300 p-2 max-w-max ${
                    selectedSize === size ? "bg-red-300" : "bg-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedSize(size);
                  }}
                >
                  {size}
                </div>
              ))
            ) : (
              <div>Sizes Not available</div>
            )}
          </div>
        </div>

        {/* <div className="max-h-max w-full">
          <h1 className="my-4">Quantity</h1>
          <div className="p-2 flex items-center gap-4 ">
            <button
              id="minus"
              className="h-12 w-12 flex items-center justify-center bg-red-300"
              onClick={countop}
            >
              -
            </button>
            <div>{count}</div>
            <button
              id="plus"
              className="h-12 w-12 flex items-center justify-center bg-red-300"
              onClick={countop}
            >
              +
            </button>
          </div>
        </div> */}

        <div className="max-h-max w-full flex flex-col gap-2 my-4 ">
          <button
            id="addcart"
            className="h-12 w-full flex items-center justify-center bg-gray-400"
            onClick={(e)=>{
              handleCart(e,productDetails,selectedSize)
            }}
          >
            ADD TO CART
          </button>
          <button
            id="addwishlist"
            className="h-12 w-full flex items-center justify-center bg-gray-400"
            onClick={()=>{handleWhishlist(productDetails)}}
          >
            ADD TO WISHLIST
          </button>
        </div>

        <div className="h-[60%] w-full bg-red-400 shrink-0">
          <h1 className="h-[10%]">You may like this also</h1>
          <div className="h-[90%] w-full flex overflow-x-auto shrink-0">
            <div className="h-[100%] w-[50%] bg-red-300 p-2 shrink-0">
              <div className="h-[50%] w-full bg-blue-300   "></div>
              <div className="h-[35%] w-full bg-pink-300 "></div>
              <div className="h-[15%] w-full bg-yellow-300 "></div>
            </div>
            <div className="h-[100%] w-[50%] bg-red-300 p-2 shrink-0 ">
              <div className="h-[50%] w-full bg-blue-300  "></div>
              <div className="h-[35%] w-full bg-pink-300 "></div>
              <div className="h-[15%] w-full bg-yellow-300 "></div>
            </div>
            <div className="h-[100%] w-[50%] bg-red-300 p-2 shrink-0">
              <div className="h-[50%] w-full bg-blue-300  "></div>
              <div className="h-[35%] w-full bg-pink-300 "></div>
              <div className="h-[15%] w-full bg-yellow-300 "></div>
            </div>
          </div>
        </div>

        <div className="max-h-max w-full ">
          <h1 className="">Reviews</h1>
          <div className="relative max-h-max w-full ">
            <h1 className="">Reviews</h1>
            <p className="break-words">
              kudnvonofvifnvfel jdvdvvuefvhiuefhvfeu efvuhefvhevheohoehvo
            </p>
            <p className="absolute right-0 bottom-0">12-10-1000</p>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default ProductDetails;
