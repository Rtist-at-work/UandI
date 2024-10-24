import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./mobile components/Footer";
import { IoIosClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Buffer } from "buffer";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const StylesPage = () => {
  // const [popup, setPopup] = useState("false");
  const [filteredStyles, setFilteredStyles] = useState([]);
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const location = useLocation();

  const URI = "http://localhost:5000";

  const navigate = useNavigate();

  const handleproductlist = (e) => {
    navigate(`/admin/productpage/?stylenav=${e.target.id}`);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const getproducts = async () => {
      try {
        const response = await axios.get(URI + "/productList");
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          setProductList(response.data);
          console.log(response.data.images);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getproducts();

    const getCategory = async () => {
      const category = queryParams.get("category");
      console.log(category);
      try {
        const response = await axios.get(
          `${URI}/category/?categorynav=${category}`
        );
        if (response.status === 200 || response.status === 201) {
          setCategoryList(response.data);
          console.log(response.data);
          const sl = response.data.category.filter(
            (c) => c.category === category.toLowerCase()
          );
          console.log(sl);
          setFilteredStyles(sl);
          setPopup(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getCategory();
  }, []);
  console.log(productList);

  const categoryForm = (e) => {
    e.target.id === "formopen" ? setPopup(true) : setPopup(false);
  };

  return (
    <div className=" h-[90%] w-full  rounded-md shadow-md p-4">
      <main className="xsm:h-[95%] md:h-full w-[100%]  overflow-auto scrollbar-hidden">
          <h1 className=" h-[10%] ml-2 text-xl font-bold ">STYLES</h1>
        {filteredStyles.length > 0 && filteredStyles[0].style.length > 0 ? (
          filteredStyles[0].style.map((s) => {
            console.log(s);
            let cat = productList.filter(
              (product) => product.style === s.value
            );
            return (
              <div
                id="container"
                key={s.key}
                className="h-[20%] w-[100%] xxsm:h-[35%] xsm:h-[25%] sm:h-[40%] px-4 mt-4"
              >
                <div
                  id="headerContainer"
                  className="h-[30%] sm:h-[20%] w-[100%] py-2 flex items-center justify-between"
                >
                  <p className="font-semibold md:text-md xsm:text-base">{s.value}</p>
                  <p
                    id={s.value}
                    onClick={(e) => {
                      handleproductlist(e);
                    }}
                    className=" underline text-sm  cursor-pointer"
                  >
                    See all
                  </p>
                </div>

                <div
                  id="imageContainer"
                  className=" flex gap-2 p-2 h-[70%] w-[100%]  overflow-x-auto   scrollbar-hidden"
                >
                  {cat.length > 0 ? (
                    cat.map((catItem, imgIndex) => {
                      if (catItem.images.length > 0) {
                        let base64Img = catItem.images[0];
                        return (
                          <div
                            key={`${imgIndex}`}
                            className="flex flex-shrink-0 gap-2 p-0.5 h-[100%] aspect-[1/1] rounded overflow-hidden overflow-x-auto border-2 border-gray-300"
                          >
                            <img
                              src={`data:image/png;base64,${base64Img}`}
                              alt={`product-${imgIndex}`}
                              className="h-[100%] w-[100%] "
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={`${imgIndex}`}
                            className="flex flex-shrink-0 gap-2 p-0.5 h-[100%] sm:w-[25%] xsm:w-[25%] xxsm:w-[25%] md:w-[20%] lg:w-[12%] rounded overflow-hidden overflow-x-auto border-2 border-gray-300 text-sm"
                          >
                            No Images Found
                          </div>
                        );
                      }
                    })
                  ) : (
                    <div>No Data Found</div>
                  )}
                </div>
                <hr></hr>
              </div>
            );
          })
        ) : (
          <div className="h-full w-full flex items-center justify-center font-bold text-xl">
            No Products
          </div>
        )}
      </main>
      {/* {popup &&
        filteredStyles.length > 0 &&
        filteredStyles[0].style.length > 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[70%] w-[80%] max-w-lg max-h-[500px] border-2 border-gray-300 bg-red-200 p-4 rounded-lg overflow-auto">
            {filteredStyles[0].style.map((s, index) => (
              <div
                key={s.key}
                className="relative flex items-center border-2 border-gray-300 min-h-12 max-h-max w-full flex items-center justify-between rounded-lg bg-blue-100"
              >
                <input
                  type="text"
                  value={s.value}
                  // onChange={handleStyleEdit} // Uncomment and implement if needed
                  className="outline-none h-12 w-[80%] px-4 flex items-center justify-between rounded-lg bg-blue-100"
                />
                <MdDelete
                  className="h-6 w-[20%] right-4 top-1 text-red-600 cursor-pointer"
                  onClick={() => handleDel(index)}
                />
              </div>
            ))}
            <button className="h-12 w-24 mt-4 flex items-center justify-center mx-auto border-2 border-gray-300 font-bold rounded bg-blue-300">
              Submit
            </button>
          </div>
        )} */}

      <footer className="h-[5%] w-ful md:hidden xsm:block">
        <Footer />
      </footer>
    </div>
  );
};

export default StylesPage;
