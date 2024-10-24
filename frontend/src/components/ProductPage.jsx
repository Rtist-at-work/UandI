import { Buffer } from "buffer";
import React, { useEffect, useState } from "react";
import Footer from "./mobile components/Footer";
import { MdEditSquare } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {


  const URI = "http://localhost:5000";
  const navigate =useNavigate();

  const [filteredProduct,setFilteredProduct] = useState([]);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const stylenav = queryParams.get("stylenav")
    const getproducts = async () => {
      try {
        const response = await axios.get(URI + `/productList/?stylenav=${stylenav}`);
        if (response.status === 200 || response.status === 201) {        
          setFilteredProduct(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    getproducts();

  }, []);

  return (
    <div className="h-[93%] w-[100%]">
      {/* Conditional Rendering with Null Check */}
      <h1 className="h-[10%] flex text-lg p-2 items-center">
        {filteredProduct && filteredProduct.length > 0 ? filteredProduct[0].category : "No Category"}
      </h1>
  
      <div className="h-[85%] w-[100%] overflow-auto flex flex-wrap px-2 gap-1 xxsm:px-4 justify-start ">
        {filteredProduct && filteredProduct.length > 0 ? (
          filteredProduct.map((product, index) => {
            let image = null;
            if (product.images.length > 0) {
              const imageBuffer = product.images[0];
              image = `data:image/png;base64,${imageBuffer}`;
            }  
            return (
              <div
                key={index}
                className="relative overflow-hidden max-h-max  w-36 md:w-44 p-1 rounded"
              >
                <div className="max-h-max w-[100%] bg-red-200">
                  <MdEditSquare
                    id={product.id}
                    className="absolute right-0 top-0 h-8 w-[15%] bg-white text-gray-500 cursor-pointer"
                    onClick={() => {
                      navigate(`/admin/editproducts`,{state:{product}});
                    }}
                  />
                  {product.images.length > 0 ? (
                    <img
                      src={image}
                      className="h-36 md:h-44 w-[100%] object-cover rounded"
                      alt={`product-${index}`}
                    />
                  ) : (
                    <div className="h-[150px] w-[100%] flex items-center justify-center">
                      No Images Found
                    </div>
                  )}
                  <div className="h-[70px] w-[100%] flex flex-col justify-center gap-2 p-1">
                    <p className="xsm:text-sm">
                      {product.name.length > 20 ? `${product.name.slice(0, 20)}...` : product.name}
                    </p>
                    <p className="xsm:text-sm">
                      Rs.{product.price}/-
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
}  
//mmvml

export default ProductPage;
