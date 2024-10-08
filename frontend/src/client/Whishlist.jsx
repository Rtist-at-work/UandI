import React, { useState, useEffect } from "react";
import Footer from "../components/mobile components/Footer";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div className="h-[93%] w-[100%]">
      <h1 className="h-[10%] flex text-lg p-2 items-center">MY WISHLIST</h1>
      <div className="h-[85%] w-[100%] overflow-auto grid xsm:grid-cols-2 gap-1 p-1 place-content-between">
        {whishlist && whishlist.length > 0 ? (
          whishlist.map((products, index) => {
            console.log(index);
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
                className="relative overflow-hidden h-auto w-[100%] p-1 border-2 border-gray-300 rounded"
                onClick={() => {
                  if (product) {
                    navigate("/productDetails", { state: { product } });
                  }
                }}
              >
                <div className="relative h-[100%] w-[100%]">
                  <MdDelete
                    id={product ? product.id : null}
                    className="absolute right-0 top-0  h-[10%] w-[15%] bg-white  text-red-500 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletewhishlist(index);
                    }}
                  />
                  {product && product.images ? (
                    <img
                      src={image}
                      className="h-[150px] w-[100%] object-cover"
                      alt={`product-${index}`}
                    />
                  ) : (
                    <div className="h-[150px] w-[100%] flex items-center justify-center">
                      No Images Found
                    </div>
                  )}
                  <div className="h-auto w-[100%] flex flex-col justify-center gap-3 p-1">
                    <p className="xsm:text-sm">
                      {product && product.name.length > 20
                        ? `${product.name.slice(0, 20)}...`
                        : product
                        ? product.name
                        : "Unknown"}
                    </p>
                    <p className="xsm:text-sm">
                      {product ? `Rs.${product.price}/-` : "Price Unavailable"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full w-full flex items-center justify-center text-lg">
            No Products Found
          </div>
        )}
      </div>

      <div className="absolute h-[5%] w-[100%] flex items-center justify-center bottom-0 bg-gray-300">
        <Footer />
      </div>
    </div>
  );
};

export default Whishlist;
