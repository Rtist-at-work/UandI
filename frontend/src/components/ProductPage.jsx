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
    <div className="absolute h-[90%] w-full bg-white-800 rounded-md shadow-md">
    {/* Conditional Rendering with Null Check */}
    <main className="xsm:h-[95%] md:h-full w-full">
      <h1 className="h-[10%] flex text-lg p-2 items-center">
        {filteredProduct && filteredProduct.length > 0 ? filteredProduct[0].category : "No Category"}
      </h1>
  
      <div className="h-[90%] w-full overflow-y-auto px-2 py-4 grid grid-cols-2 md:grid-cols-4 gap-2 cursor-pointer hover:shadow-inner scrollbar-hidden">
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
                className="relative w-full max-h-max shadow-md shrink-0 rounded bg-white shadow-sm p-2 border-2 border-gray-300"
              >
                <div className="w-full">
                  <MdEditSquare
                    id={product.id}
                    className="absolute right-0 top-0 h-8 w-[15%] bg-white text-gray-500 cursor-pointer"
                    onClick={() => {
                      navigate(`/admin/editproducts`, { state: { product } });
                    }}
                  />
                  {product.images.length > 0 ? (
                    <img
                      src={image}
                      className="w-full aspect-[1/1] object-cover rounded"
                      alt={`product-${index}`}
                    />
                  ) : (
                    <div className="h-[150px] w-full flex items-center justify-center">
                      No Images Found
                    </div>
                  )}
                  <div className="h-[70px] w-full flex flex-col justify-center gap-2 p-1">
                    <p className="xsm:text-sm">
                      {product.name.length > 20 ? `${product.name.slice(0, 20)}...` : product.name}
                    </p>
                    <p className="xsm:text-sm">Rs.{product.price}/-</p>
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
    </main>
  
    <div className="absolute h-[5%] w-full md:hidden xsm:block flex items-center justify-center bottom-0 bg-gray-300">
      <Footer />
    </div>
  </div>
  
  );
}  
//mmvml

export default ProductPage;
