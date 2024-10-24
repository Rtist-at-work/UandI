import React, { useState } from "react";
import uandiLogo from "../assets/uandilogo.jpg";
import { CgProfile } from "react-icons/cg";
import { MdOutlineShoppingCart } from "react-icons/md";
import Footer from "./Footer";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa6";
import Header from "./Header";

const ProductDetails = ({ handleCart, handleWhishlist }) => {
  const [index, setIndex] = useState(0);
  const [isDescription, setIsDescription] = useState(false);
  const [isProductDetails, setIsProductDetails] = useState(false);
  const [isReturnPolicy, setIsReturnPolicy] = useState(false);
  const [selectedSize, setSelectedSize] = useState();
  const [productDetails, setProductDetails] = useState(null); // To store product details
  const [review, setReview] = useState([]); // To store product details
  const URI = "http://localhost:5000";

  // Call useLocation at the top level of the component
  const location = useLocation();

  // Extract productId from the query string
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("id"); // Assuming query string like ?id=12345

  console.log(productId);

  // Fetch product details based on the productId
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Make a request to get the product details using productId
        const response = await axios.get(`${URI}/productList`, {
          params: {
            productDetails: productId,
          },
        });
        console.log(response);
        setProductDetails(response.data.product); // Assuming your API returns product details
        setReview(response.data.reviews);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    if (productId) {
      fetchProduct(); // Fetch product only if productId is not null
    }
  }, [productId]); // Include productId as a dependency for useEffect

  const toggleAnswer = (e) => {
    const { id } = e.target;
    console.log(id)
    if (id === "description") setIsDescription(!isDescription);
    if (id === "productdetails") setIsProductDetails(!isProductDetails);
    if (id === "returnpolicy") setIsReturnPolicy(!isReturnPolicy);
  };

  return (
    <div className="h-screen w-screen overflow-auto scrollbar-hidden">
  <Header />
  <main className="md:max-h-max md:min-h-full w-full md:grid md:grid-cols-2">
    {/* Product Image */}
    <div className="md:h-full md:col-start-1 md:col-span-1  flex flex-col gap-4 mt-4">
      {productDetails && productDetails.images && productDetails.images.length > 0 ? (
        <img
          src={`data:image/png;base64,${productDetails.images[index]}`}
          className="md:w-[60%] xsm:w-[90%] aspect-[1/1] mx-auto object-cover rounded-md shadow-lg"
          alt="Product"
        />
      ) : (
        <p className="text-center text-red-500">Image not available</p>
      )}
      <div className="md:w-[60%] bg-pink-300 xsm:w-[90%] aspect-[4/1] mx-auto flex flex-shrink-0 gap-1 overflow-auto scrollbar-hidden py-4">
        {productDetails && productDetails.images && productDetails.images.length > 0
          ? productDetails.images.map((image, index) => (
              <img
                key={index}
                src={`data:image/png;base64,${image}`}
                alt="Thumbnail"
                className="relative h-full aspect-[1/1] rounded-md cursor-pointer border border-gray-300 shadow-md transition-transform duration-300 transform hover:scale-105"
                onClick={() => {
                  setIndex(index);
                }}
              />
            ))
          : ""}
      </div>
    </div>

    {/* Product Details */}
    <div className="h-full w-full flex flex-col gap-2 p-4 bg-white rounded-md mt-4">
      <h1 className="text-xl font-semibold">{productDetails?.name || "Product Name"}</h1>
      <h2 className="text-lg font-bold text-green-600">{productDetails?.price || "Product Price"}</h2>
      <div className="border-2 border-gray-300 p-2 rounded-md shadow-sm">
        <h3 className="font-semibold cursor-pointer" >Description</h3>
          <div className="mt-2">{productDetails?.description || "No description available"}</div>
        <hr className="my-2" />
        <h3 className="font-semibold cursor-pointer" >Product Details</h3>

          <div className="mt-2">Details not available</div>
        <hr className="my-2" />
        <h3 className="font-semibold cursor-pointer" >Return Policy</h3>
          <div className="mt-2">Policy details not available</div>
      </div>

      <div className="flex flex-col gap-4 my-4">
        <h4 className="my-4">Size</h4>
        <div className="flex flex-wrap gap-2">
          {productDetails ? (
            productDetails.sizes.map((size) => (
              <div
                key={size}
                id={size}
                className={`border-2 border-gray-300 p-2 max-w-max rounded-md transition-colors duration-300 cursor-pointer ${
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

        <div className="flex flex-col gap-2 my-4">
          <button
            id="addcart"
            className="h-12 w-full flex items-center justify-center bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-300"
            onClick={(e) => {
              handleCart(e, productDetails, selectedSize);
            }}
          >
            ADD TO CART
          </button>
          <button
            id="addwishlist"
            className="h-12 w-full flex items-center justify-center bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-300"
            onClick={() => {
              handleWhishlist(productDetails);
            }}
          >
            ADD TO WISHLIST
          </button>
        </div>
      </div>
    </div>

    {/* Other Products */}
    <div className="w-full md:aspect-[3/1] aspect-[4/3] mt-8 md:col-start-1 md:col-span-2 p-4 bg-pink-200 rounded-md shadow-md">
      <h2 className="text-lg font-semibold">You may like this also</h2>
      <div className="h-full aspect-[1/2] bg-red-300 p-2 mt-4">
        <div className="h-[50%] w-full bg-blue-300"></div>
        <div className="h-[35%] w-full bg-pink-300"></div>
        <div className="h-[15%] w-full bg-yellow-300"></div>
      </div>
    </div>

    {/* Reviews */}
    <h1 className="text-2xl font-bold mb-4 mt-4 md:col-start-1 md:col-span-2">Reviews</h1>
    <div className="min-h-max w-full md:col-start-1 md:col-span-2 grid md:grid-cols-4 xsm:grid-cols-2 gap-4">
      {review &&
        review.map((review, index) => (
          <div
            key={index}
            className="relative bg-white md:w-[90%] xsm:w-[90%] shadow-lg rounded-lg p-4 mb-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-xs break-words">
                {review.username ? review.username : "Anonymous"}
              </p>
              <div className="flex gap-1 items-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <FaStar
                    key={rating}
                    className={`text-sm ${
                      review.stars >= rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
              {review.image && review.image.length > 0 && (
                <div className="w-full overflow-x-auto scrollbar-hidden whitespace-nowrap">
                  <div className="flex">
                    {review.image.map((image, i) => (
                      <img
                        key={i}
                        src={`data:image/png;base64,${image}`}
                        className="w-[50%] h-auto aspect-square object-cover mr-2 rounded-lg border-2 border-gray-200"
                        alt={`Review image ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              <article className="text-gray-700 text-sm mb-2 break-words mt-2 mb-8">
                {review.text ? review.text : ""}
              </article>
              <div className="absolute right-0 bottom-0 text-gray-400 text-xs ">
                12-10-1000
              </div>
          </div>
        ))}
    </div>

    <footer className="md:col-start-1 md:col-span-2">
      <Footer />
    </footer>
  </main>
</div>

  );
};

export default ProductDetails;
