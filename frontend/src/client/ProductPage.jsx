import React, { useEffect, useState } from "react";
import uandiLogo from "../assets/uandilogo.jpg";
import { IoChevronDown } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Buffer } from "buffer";
import { useLocation } from "react-router-dom";
import Categories from "../components/Categories";
import Footer from "./Footer";
import axios from "axios";
import { FaStar } from "react-icons/fa6";
import Header from "./Header";

const ProductPage = () => {
  const URI = "http://localhost:5000";

  const [isOpen, setIsOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(true);
  const [faq, setFaq] = useState(false);
  const [styleList, setStyleList] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState();
  const [stylenav, setStyleNav] = useState("");
  const [categorynav, setCategoryNav] = useState("");
  const [price, setPrice] = useState();
  const [priceFrom, setPriceFrom] = useState();
  const [priceTo, setPriceTo] = useState();
  const [color, setColor] = useState();
  const [size, setSize] = useState();
  const [triggerLocalStorage, setTriggerLocalStorage] = useState();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cn = queryParams.get("categorynav");
    setCategoryNav(queryParams.get("categorynav"));
    setStyleNav(queryParams.get("stylenav"));

    const getproducts = async () => {
      try {
        const response = await axios.get(URI + "/productList");
        if (response.status === 200 || response.status === 201) {
          setProductList(response.data);
          console.log(response);
        }
      } catch (err) {
        console.log(err);
      }
      if (cn) {
        try {
          const response = await axios.get(
            `${URI}/category/?categorynav=${cn}`
          );
          if (response.status === 200 || response.status === 201) {
            setCategoryList(response.data.category);
            setStyleList(response.data.styleList);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    getproducts();
  }, [location.search]); // Only run once when the component mounts

  useEffect(() => {
    setFilteredProduct(
      productList.filter((product) => {
        return product.style === stylenav;
      })
    );
  }, [productList, stylenav]);

  const handleStyleNav = (c, s) => {
    setStyleNav(s);
    setCategoryNav(c);
    const pl = productList.filter((p) => p.style === s);
    setFilteredProduct(pl);
    navigate(`/productpage?categorynav=${c}&stylenav=${s}`);
  };

  const toggleAnswer = (e) => {
    const id = e.target.id;
    if (id === "price") setIsPriceOpen(!isPriceOpen);
    else if (id === "color") setIsColorOpen(!isColorOpen);
    else if (id === "size") setIsSizeOpen(!isSizeOpen);
    else if (id === "filter") setIsOpen(!isOpen);
    else if (id === "faq") setFaq(!faq);
  };

  const handlePriceFIlter = (e) => {
    const id = e.target.id;
    if (id == "pricefrom") {
      setPriceFrom(e.target.value);
      if (priceFrom > 0) {
        const pricefilter = filteredProduct.filter((product) => {
          return product.price > priceFrom;
        });
        setFilteredProduct(pricefilter);
      }
    }
  };

  return (
    <div className="h-screen w-screen relative ">
      <Header />
      <main className=" h-[85%] w-full  overflow-y-auto scrollbar-hidden ">
        <div className="max-h-max w-full flex   justify-start items-center">
          <Link to="/">
            <div className="px-4 py-2 lg:text-xl">Home</div>
          </Link>
          <div className=" overflow-y-none flex scrollbar-hidden">
            {categoryList && categoryList.length > 0 ? (
              categoryList.map((category) =>
                category.category === categorynav ? null : ( // Use `null` instead of an empty string
                  <div key={category.category} className="relative group ml-4">
                    <a className="cursor-pointer lg:text-xl text-gray-600">
                      {category.category}
                    </a>
                    <ul className="absolute left-0 hidden group-hover:block bg-white border gap-4 z-[999] min-w-max rounded">
                      {category.style.length > 0 ? (
                        category.style.map((style) => (
                          <li
                            className="px-4 py-2 shrink-0 min-w-max cursor-pointer"
                            onClick={() => {
                              navigate(
                                `/productpage?categorynav=${category.category}&stylenav=${style.value}`
                              );
                            }}
                          >
                            {style.value}
                          </li>
                        ))
                      ) : (
                        <div>Styles not found</div>
                      )}
                    </ul>
                  </div>
                )
              )
            ) : (
              <div>No data</div>
            )}
          </div>
        </div>

        <div className="h-[30%] lg:h-[70%] w-full bg-red-200"></div>
        <div className="  h-[10%] w-full flex z-10">
          <div
            className="h-full w-[20%] flex items-center bg-gray-100 justify-center  z-10"
            onClick={(e) => {
              toggleAnswer(e);
            }}
          >
            <h1 id="filter">Filter</h1>
          </div>
          <div className="h-full w-[80%]  bg-green-100 flex items-center justify-start overflow-x-auto  scrollbar-hidden scroll px-4">
            <ul className="flex space-x-8 cursor-pointer xsm:text-sm">
              <li className="font-semibold min-w-max text-teal-900 lg:text-xl">
                {categorynav}
              </li>
              <li className=" min-w-max border-b-2 border-teal-900 lg:text-xl">
                {stylenav}
              </li>
              {styleList.length > 0
                ? styleList[0].style.map((s) => {
                    return (
                      <li
                        key={s.key}
                        className={` min-w-max ${
                          stylenav === s.value ? "hidden" : ""
                        } lg:text-xl`}
                        onClick={() => {
                          handleStyleNav(categorynav, s.value);
                        }}
                      >
                        {s.value}
                      </li>
                    );
                  })
                : console.log("nok")}
            </ul>
          </div>
        </div>

        <div className="relative min-h-max flex w-full  flex  justify-start ">
          <div
            className={`max-h-max w-[20%] md:block xsm:${
              isOpen ? "absolute w-[80%] block" : "hidden"
            } text-gray-600 bg-gray-100 p-4 z-10`}
          >
            <div className=" p-4 flex flex-col space-y-6">
              <div
                id="price"
                className="w-full flex justify-between items-center"
                onClick={(e) => {
                  toggleAnswer(e);
                }}
              >
                <p>Price</p>
                <IoChevronDown
                  id="price"
                  className=""
                  onClick={(e) => {
                    toggleAnswer(e);
                  }}
                />
              </div>
              {isPriceOpen && (
                <div className="flex gap-4 mt-[10%]">
                  <input
                    id="pricefrom"
                    type="number"
                    className="w-[50%]"
                    onChange={handlePriceFIlter}
                  ></input>
                  to
                  <input
                    id="priceto"
                    type="number"
                    className="w-[50%]"
                    onChange={handlePriceFIlter}
                  ></input>
                </div>
              )}
              <hr></hr>
              <div
                id="size"
                className="w-full flex justify-between items-center"
                onClick={(e) => {
                  toggleAnswer(e);
                }}
              >
                <p>Size</p>
                <IoChevronDown
                  id="size"
                  className=""
                  onClick={(e) => {
                    toggleAnswer(e);
                  }}
                />
              </div>
              {isSizeOpen && <div>6 month</div>}
              <hr></hr>
              <div
                id="color"
                className="w-full flex justify-between items-center"
                onClick={(e) => {
                  toggleAnswer(e);
                }}
              >
                <p>Color</p>
                <IoChevronDown
                  id="color"
                  className=""
                  onClick={(e) => {
                    toggleAnswer(e);
                  }}
                />
              </div>
              {isColorOpen && <div>6 month</div>}
            </div>
            <hr></hr>
            <div className="flex justify-end items-end w-full ">
              <button className=" mt-2 right-0 max-h-max max-w-max p-2 border-2 border-gray-300 bg-blue-600 text-white rounded ">
                View Results
              </button>
            </div>
          </div>
          <div className="relative min-h-max md:w-[80%] xsm:w-full  grid grid-cols-2 lg:grid-cols-4 gap-4 p-2">
            {filteredProduct.length > 0
              ? filteredProduct.map((product, index) => {
                  return (
                    <div
                      key={index}
                      className="relative overflow-hidden p-1 cursor-pointer  rounded z-0 w-full"
                      onClick={() => {
                        navigate(`/productDetails?id=${product.id}`);
                      }}
                    >
                      <div className="w-full h-full ">
                        {product.offer > 0 && (
                          <div className="absolute top-2 right-2 bg-green-100 text-gray-600 font-semibold max-w-max max-h-max p-2 rounded">
                            {" "}
                            sale {product.offer}%
                          </div>
                        )}
                        {product.images.length > 0 ? (
                          <img
                            key={index + "img"}
                            src={`data:image/png;base64,${product.images[0]}`}
                            className="object-cover w-full aspect-[1/1] rounded border-2 border-gray-300 transition-transform duration-300 ease-in-out hover:scale-110"
                            alt={`product-${index}`}
                          />
                        ) : (
                          <div className="h-[200px] w-full break-words flex items-center justify-center bg-gray-100">
                            No Images Found
                          </div>
                        )}
                        <div className="flex-grow min-h-24 flex flexwrap mt-4 flex-col gap-2  ">
                          <p className="xsm:text-xsm md:text-base  font-semibold">
                            {product && product.name.length > 30
                              ? `${product.name.slice(0, 30)}...`
                              : product
                              ? product.name
                              : "Unknown"}
                          </p>
                          <div className="flex gap-2 items-center">
                            {product && (
                              <>
                                {product && product.offer > 0 && (
                                  <p className="text-base font-semibold">
                                    {`₹${(
                                      product.price -
                                      (product.price / 100) * product.offer
                                    ).toFixed(2)}/-`}
                                  </p>
                                )}
                                <p
                                  className={`${
                                    product.offer > 0
                                      ? "line-through text-sm text-gray-500"
                                      : "text-base font-semibold"
                                  }`}
                                >
                                  {product.price
                                    ? `₹${product.price}/-`
                                    : "Price Unavailable"}
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
                          ) : (
                            <div className="text-gray-500 md:text-base xsm:text-xs">
                              no reviews
                            </div>
                          )}
                        </div>{" "}
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
        <div className="min-h-max w-full  overflow-x-auto z-0 px-2">
          <h1 className="my-4">INSTRUCTIONS</h1>
          <ul className="ml-6 list-decimal xsm:text-sm flex flex-col gap-2 ">
            <li>
              <p>hw was your day?</p>
            </li>
            <li>Our Story</li>
            <li>Blog</li>
            <li>Privacy</li>
          </ul>
        </div>
        <div className="min-h-max w-full overflow-x-auto px-2">
          <h1 className="py-4">FAQ</h1>
          <div className="mb-4  w-[90%] flex flex-col px-2">
            <div className="relative flex w-full border-b-2   border-green-900 ">
              <button
                id="faq"
                onClick={(e) => {
                  toggleAnswer(e);
                }}
                className="text-left w-[90%] px-4 py-2  text-lg text-sm focus:outline-none break-all"
              >
                How was your day ?
              </button>
              <IoChevronDown className="absolute right-2 top-[25%]" />
            </div>
            {faq && (
              <div className="mt-2 px-4 py-2  text-gray-600 bg-gray-100 border-2 border-t-0 border-gray-300 rounded">
                kjdndmnnmvldkm
              </div>
            )}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default ProductPage;
