import React, { useState, useEffect } from "react";
import Footer from "../components/mobile components/Footer";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { FaStar } from "react-icons/fa6";

const Whishlist = () => {
  const URI = "http://localhost:5000";

  const [whishlist, setWhishlist] = useState([]);
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getproducts = async () => {
      try {
        const response = await axios.get(URI + "/productList");
        if (response.status === 200 || response.status === 201) {
          setProductList(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getproducts();

    const getwhishlist = async () => {
      try {
        const response = await axios.get(`${URI}/auth/getWhishlist`);
        if (response.status === 200 || response.status === 201) {
          setWhishlist(response.data.cart);
          console.log(response.data.cart);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getwhishlist();
  }, []);

  const deletewhishlist = (index) => {
    console.log(index);
    const updatedwhishlist = [...whishlist];
    updatedwhishlist.splice(index, 1);
    setWhishlist(updatedwhishlist);
    const deletewhishlistProduct = async () => {
      try {
        const productId = whishlist[index].productId;
        const response = await axios.put(
          `${URI}/auth/deletewhishlist/${productId}`
        );
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    deletewhishlistProduct();
  };
  return (
    <div className="relative h-screen w-screen">
      <Header />
      <div className="max-h-max w-full p-4 ">
        <h1 className="h-[10%] flex text-lg p-2 items-center">MY WISHLIST</h1>

        {whishlist && whishlist.length > 0 ? (
          whishlist.map((products, index) => {
            let product = null;

            if (productList) {
              product = productList.find(
                (product) => product.id === products.productId
              );
            }

            // Ensure 'product' is not null or undefined before accessing its properties
            let image = null;
            if (product && product.images && product.images.length > 0) {
              const imageBuffer = product.images[0];
              image = `data:image/png;base64,${imageBuffer}`;
            }

            return (
              <div
                key={index}
                className="relative flex items-center justify-between xxsm:w-[90%] cursor-pointer md:w-[80%] mx-auto shadow-md p-2 mb-8 rounded"
                onClick={() => {
                  navigate(`/productDetails?id=${product.id}`);
                }}
              >
                {product && product.images ? (
                  <img
                    src={image}
                    className="sm:w-32 xsm:w-24 xsm:h-24 sm:h-32 xsm:w-24 xsm:h-24 aspect-square object-cover mr-4" // Thumbnail size
                    alt={`product-${index}`}
                  />
                ) : (
                  <div className="sm:w-32 xsm:w-24 xsm:h-24 sm:h-32 xsm:w-24 xsm:h-24 aspect-square flex items-center justify-center bg-gray-200 mr-4">
                    No Images Found
                  </div>
                )}
                <div className="flex-grow flex flex-col gap-2  ">
                  <p className="xsm:text-xsm md:text-base  font-semibold">
                    {product && product.name.length > 30
                      ? `${product.name.slice(0, 30)}...`
                      : product
                      ? product.name
                      : "Unknown"}
                  </p>
                  <div className="flex gap-2 items-center">
                    {product && product.offer > 0 && (
                      <>
                        <p className="text-base font-semibold">
                          {product
                            ? `₹${(
                                product.price -
                                (product.price / 100) * product.offer
                              ).toFixed(2)}/-`
                            : "Price Unavailable"}
                        </p>
                        <p
                          className={`${
                            product.offer > 0
                              ? "line-through text-sm text-gray-500"
                              : "text-base font-semibold"
                          }`}
                        >
                          {product
                            ? `₹${product.price}/-`
                            : "Price Unavailable"}
                        </p>
                        <p className="text-sm text-green-700 font-semibold">
                          {product.offer}% Off
                        </p>
                      </>
                    )}
                  </div>
                  {product && product.review.stars ? (
                    <div className="px-2 py-1 max-w-max bg-green-700 gap-2 flex items-center gap-1 rounded">
                      <p className="font-semibold text-sm text-white">
                        {product.review.stars}
                      </p>
                      <FaStar className="xsm:h-3 xsm:w-3 md:h-2 xsm:w-2 text-white" />
                    </div>
                  ): 
                  (
                    <div className="text-gray-500 md:text-base xsm:text-xs">no reviews</div>
                  )
                  }
                </div>
                <MdDelete
                  id={product ? product.id : null}
                  className="absolute top-2 right-2 h-6 w-4 bg-white text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletewhishlist(index);
                  }}
                />
              </div>
            );
          })
        ) : (
          <div className="h-full w-full flex items-center justify-center text-lg">
            No Products Found
          </div>
        )}
      </div>
    </div>
  );
};

export default Whishlist;
