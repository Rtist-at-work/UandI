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
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const ProductDetails = ({ handleCart }) => {
  const [index, setIndex] = useState(0);
  // const [isDescription, setIsDescription] = useState(false);
  // const [isProductDetails, setIsProductDetails] = useState(false);
  // const [isReturnPolicy, setIsReturnPolicy] = useState(false);
  const [selectedSize, setSelectedSize] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const [productDetails, setProductDetails] = useState(null); // To store product details
  const [otherProducts, setOtherProducts] = useState([]);
  const [review, setReview] = useState([]); // To store product details
  const containerRef = useRef(null);

  const navigate = useNavigate();
  const URI = "http://localhost:5000";

  // Call useLocation at the top level of the component
  const location = useLocation();

  // Extract productId from the query string
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("id"); // Assuming query string like ?id=12345

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
        setOtherProducts(() => {
          const op = response.data.otherProducts.filter(
            (product) => product != response.data.product
          );
          return op;
        });
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

  // const toggleAnswer = (e) => {
  //   const { id } = e.target;
  //   console.log(id);
  //   if (id === "description") setIsDescription(!isDescription);
  //   if (id === "productdetails") setIsProductDetails(!isProductDetails);
  //   if (id === "returnpolicy") setIsReturnPolicy(!isReturnPolicy);
  // };

  return (
    <div
      className="h-screen w-screen overflow-auto scrollbar-hidden"
      ref={containerRef}
    >
      <Header />
      <main className="md:max-h-max md:min-h-full w-full md:grid md:grid-cols-2 ">
        {/* Product Image */}
        <div className="md:h-full md:col-start-1 md:col-span-1  flex flex-col gap-4 mt-4">
          {productDetails &&
          productDetails.images &&
          productDetails.images.length > 0 ? (
            <div className="relative">
              {/* Product Image */}
              <img
                src={`data:image/png;base64,${productDetails.images[index]}`}
                alt="Product"
                className="md:w-[60%] xsm:w-[90%] aspect-[1/1] mx-auto object-cover rounded-md shadow-lg"
              />

              {/* Color Overlay */}
              <div
                className="absolute inset-0 bg-[selectedColor]"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>
          ) : (
            <p className="text-center text-red-500">Image not available</p>
          )}
          <div className="md:w-[60%] xsm:w-[90%] aspect-[4/1] mx-auto flex flex-shrink-0 gap-1 overflow-auto scrollbar-hidden lg:py-4 md:py-0 xsm:py-2">
            {productDetails &&
            productDetails.images &&
            productDetails.images.length > 0
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
        <div className="h-full w-full flex flex-col gap-2 p-4 bg-white rounded-md mt-4 mb-8">
          <div className="flex-grow min-h-24 flex flexwrap mt-4 flex-col gap-4  ">
            <p className="xsm:text-xl sm:text-4xl leading-loose font-semibold text-customRed font-fredoka">
              {productDetails?.name}
              {/* {productDetails && productDetails.name.length > 30
                ? `${productDetails.name.slice(0, 30)}...`
                : productDetails
                ? productDetails.name
                : "Unknown"} */}
            </p>
            <div className="flex gap-2 items-center">
              {productDetails && (
                <>
                  {productDetails && productDetails.offer > 0 && (
                    <p className="xsm:text-base sm:text-xl font-semibold text-customRed">
                      {`₹${(
                        productDetails.price -
                        (productDetails.price / 100) * productDetails.offer
                      ).toFixed(2)}/-`}
                    </p>
                  )}
                  <p
                    className={`${
                      productDetails.offer > 0
                        ? "line-through xsm:text-sm sm:text-md  text-gray-500"
                        : "xsm:text-base sm:text-xl font-semibold"
                    }`}
                  >
                    {productDetails.price
                      ? `₹${productDetails.price}/-`
                      : "Price Unavailable"}
                  </p>
                  {productDetails.offer > 0 && (
                    <div className=" text-green-700 font-semibold max-w-max max-h-max p-1 rounded">
                      {" "}
                      {productDetails.offer}% Off
                    </div>
                  )}
                </>
              )}
            </div>

            {productDetails && productDetails.review.stars ? (
              <div className="flex gap-1 items-center">
                {[1, 2, 3, 4, 5].map((rating) => {
                  const isFilledStar =
                    rating <= Math.floor(productDetails.review.stars);

                  // Check if this star is the one with the half-star condition
                  const isHalfStar =
                    rating === Math.ceil(productDetails.review.stars) &&
                    !Number.isInteger(productDetails.review.stars);
                  return isHalfStar ? (
                    <FaRegStarHalfStroke
                      key={rating}
                      className={`text-sm ${"text-yellow-500"}`}
                    />
                  ) : (
                    <FaStar
                      key={rating}
                      className={`text-sm ${
                        productDetails.review.stars >= rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-500 md:text-base xsm:text-xs">
                no reviews
              </div>
            )}
          </div>
          <hr></hr>
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
            <h4 className="my-4">colors</h4>
            <div className="flex flex-wrap gap-2 max-h-max w-full cursor-pointer">
              {productDetails ? (
                productDetails.colors.map((color, index) => {
                  const colorname = color.color; // Get the first key, e.g., 'blue'
                  const base64Image = color.image; // Access the Base64 string using the color name

                  return (
                    <img
                      className={`h-16 aspect-[1/1] border-2 rounded ${
                        selectedColor === colorname
                          ? "border-black"
                          : " border-gray-300"
                      }`}
                      onClick={() => {
                        setSelectedColor(colorname);
                      }}
                      key={index} // Added key for each image element
                      src={`data:image/png;base64,${base64Image}`} // Use the Base64 string for the image source
                      alt={colorname} // Optional: add an alt attribute for accessibility
                    />
                  );
                })
              ) : (
                <div>Sizes Not available</div>
              )}
            </div>

            <div className="flex flex-col gap-2 my-4">
              <button
                id="addcart"
                className="h-12 w-full flex items-center justify-center bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-300"
                onClick={(e) => {
                  handleCart(e, productDetails, selectedSize, selectedColor);
                }}
              >
                ADD TO CART
              </button>
              <button
                id="buy"
                className="h-12 w-full flex items-center justify-center bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-300"
                onClick={(e) => {
                  handleCart(e, productDetails, selectedSize, selectedColor);
                }}
              >
                BUY NOW
              </button>
            </div>
            <div className="mt-4 rounded-md shadow-sm">
              <h3 className="font-semibold sm:text-xl xsm:text-sm cursor-pointer">
                Description
              </h3>
              <div className="mt-2">
                {productDetails?.description || "No description available"}
              </div>
              <hr className="my-2" />
              <h3 className="font-semibold cursor-pointer sm:text-xl xsm:text-sm">
                Product Details
              </h3>

              <div className="mt-2">Details not available</div>
              <hr className="my-2" />
              <h3 className="font-semibold cursor-pointer sm:text-xl xsm:text-sm">
                Return Policy
              </h3>
              <div className="mt-2">Policy details not available</div>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-semibold ">You may like this also</h2>

        {/* Other Products */}
        <div className="w-full md:max-h-max overflow-x-auto scrollbar-hidden mt-2 md:col-start-1 flex gap-2  justify-around md:col-span-2 p-4 rounded-md shadow-md">
          {otherProducts &&
            otherProducts.map((product, index) => (
              <div
                className="md:h-96 xsm-h-64  xsm:w-32 md:w-48 bg-gray-100 rounded p-2 flex flex-col flex-shrink-0 "
                onClick={() => {
                  setIndex(0);
                  navigate(`/productDetails?id=${product.id}`);
                  if (containerRef.current) {
                    containerRef.current.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                <img
                  key={index}
                  src={`data:image/png;base64,${product.images[0]}`}
                  alt="Thumbnail"
                  className="relative w-full aspect-[1/1] rounded-md cursor-pointer border border-gray-300 shadow-md transition-transform duration-300 transform hover:scale-105"
                  onClick={() => {
                    setIndex(index);
                  }}
                />
                <div className="max-h-max w-full flex flex-col gap-1 px-2 mt-2">
                  <p className="line-clamp-1 sm:text-xs md:text-base font-semibold">
                    {product.name}
                  </p>
                  <div className="flex  gap-2">
                    <p className="line-clamp-1 text-xs min-w-max ">
                      {product.sizes[0]}
                    </p>
                    <p className="line-clamp-1 text-xs ">
                      {product.colors[0].color}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {product && (
                      <>
                        {product.offer > 0 && (
                          <p className=" sm:text-xs md:text-base font-semibold">
                            {`₹${(
                              product.price -
                              (product.price / 100) * product.offer
                            ).toFixed(2)}/-`}
                          </p>
                        )}
                        <p
                          className={`${
                            product.offer > 0
                              ? "line-through text-xs text-gray-500"
                              : "sm:text-xs md:text-base font-semibold"
                          }`}
                        >
                          {product.price
                            ? `₹${product.price}/-`
                            : "Price Unavailable"}
                        </p>
                      </>
                    )}
                  </div>
                  {product && product.review?.stars ? (
                    <div className="px-2 py-1 max-w-max bg-green-700 gap-2 flex items-center gap-1 rounded">
                      <p className="font-semibold xsm:text-xs md:text-base text-white">
                        {product.review.stars}
                      </p>
                      <FaStar className="xsm:h-3 xsm:w-3 md:h-2 xsm:w-2 text-white xsm:text-xs md:text-base" />
                    </div>
                  ) : (
                    <div className="text-gray-500 md:text-base xsm:text-xs">
                      no reviews
                    </div>
                  )}
                </div>
                <br></br>
                <div className="mt-auto w-full ">
                  <button
                    id="addcart"
                    className="h-12 w-full xsm:text-xs md:text-base mx-auto flex items-center justify-center bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCart(
                        e,
                        product,
                        product.sizes[0],
                        product.colors[0].color
                      );
                    }}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Reviews */}
        <h1 className="text-2xl font-bold mb-4 mt-4 md:col-start-1 md:col-span-2 p-2">
          Reviews
        </h1>
        <div className="min-h-max w-full md:col-start-1 md:col-span-2 grid md:grid-cols-4 xsm:grid-cols-2 gap-4 p-2">
          {review &&
            review.map((review, index) => (
              <div
                key={index}
                className="relative bg-white md:w-[90%] xsm:w-[90%] shadow-lg rounded-lg p-4 mb-6 flex flex-col "
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
                <div className="absolute right-2 bottom-2 text-gray-400 text-xs ">
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
