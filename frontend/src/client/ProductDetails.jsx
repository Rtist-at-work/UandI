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
    if (id === "description") setIsDescription(!isDescription);
    if (id === "productdetails") setIsProductDetails(!isProductDetails);
    if (id === "returnpolicy") setIsReturnPolicy(!isReturnPolicy);
  };

  return (
    <div className="h-full w-full relative scrollbar-hidden overflow-auto">
      <Header />
      <main className="h-full w-full overflow-scroll scrollbar-hidden p-4">
        <div className="h-full w-full md:flex md:flex-row md:gap-4 overflow-auto">
          <div className="relative md:min-h-max w-full xsm:min-h-max overflow-auto ">
            {productDetails &&
            productDetails.images &&
            productDetails.images.length > 0 ? (
              <img
                src={`data:image/png;base64,${productDetails.images[index]}`}
                className="md:w-[80%] md:aspect-[1/1] xsm:w-full aspect-[1/1] object-cover mx-auto shrink-0"
                alt="Product"
              />
            ) : (
              <p>Image not available</p>
            )}
            <div className="md:w-[80%] md:aspect-[4/1] xsm:w-full xsm:aspect-[4/1] flex flex-shrink-0 gap-1 overflow-auto scrollbar-hidden mx-auto py-4">
              {productDetails &&
              productDetails.images &&
              productDetails.images.length > 0
                ? productDetails.images.map((image, index) => (
                    <img
                      key={index}
                      src={`data:image/png;base64,${image}`}
                      alt="img"
                      className="relative h-full aspect-[1/1] rounded-md cursor-pointer"
                      onClick={() => {
                        setIndex(index);
                      }}
                    />
                  ))
                : ""}
            </div>
          </div>

          <div className="h-full w-full flex flex-col gap-2 break-words ">
            <h1>{productDetails?.name || "Product Name"}</h1>
            <h1>{productDetails?.price || "Product Price"}</h1>
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

            <div className="max-h-max w-full flex flex-col gap-2 my-4">
              <button
                id="addcart"
                className="h-12 w-full flex items-center justify-center bg-gray-400"
                onClick={(e) => {
                  handleCart(e, productDetails, selectedSize);
                }}
              >
                ADD TO CART
              </button>
              <button
                id="addwishlist"
                className="h-12 w-full flex items-center justify-center bg-gray-400"
                onClick={() => {
                  handleWhishlist(productDetails);
                }}
              >
                ADD TO WISHLIST
              </button>
            </div>
          </div>
        </div>
        <div className="w-full aspect-[4/1]  mt-8 ">
          <h1 className="h-[10%] ">You may like this also</h1>
          <div className="h-[100%] aspect-[1/2] bg-red-300 p-2 shrink-0 mt-4">
            <div className="h-[50%] w-full bg-blue-300   "></div>
            <div className="h-[35%] w-full bg-pink-300 "></div>
            <div className="h-[15%] w-full bg-yellow-300 "></div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4 mt-4">Reviews</h1>
        <div className="min-h-max w-full grid md:grid-cols-4 xsm:grid-cols-2 ">
          {review &&
            review.map((review, index) => (
              <div
                key={index}
                className="bg-white md:w-[90%] md:aspect[1/1] xsm:w-[90%] xsm:aspect[1/1]  shadow-lg rounded-lg p-4 mb-6 shrink-0"
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

                <div className="relative">
                  {review.image && review.image.length > 0 && (
                    <div className="w-full overflow-x-auto whitespace-nowrap">
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

                  <p className="text-gray-700 text-sm mb-2 break-words mt-2">
                    {review.text ? review.text : ""}
                  </p>
                  <br></br>

                  <p className="absolute right-0 bottom-0 text-gray-400 text-xs">
                    12-10-1000
                  </p>
                </div>
              </div>
            ))}
          //{" "}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
