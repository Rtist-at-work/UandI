import React, { useEffect, useState } from "react";
import uandiLogo from "../assets/uandilogo.jpg";
import { IoChevronDown } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Buffer } from "buffer";
import { useLocation } from "react-router-dom";
import { FaRegSadCry } from "react-icons/fa";
import { IoHeart } from "react-icons/io5";
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
  const [posters, setPosters] = useState(null);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState();
  const [stylenav, setStyleNav] = useState("");
  const [categorynav, setCategoryNav] = useState("");
  const [sizes, setSizes] = useState();
  const [priceFrom, setPriceFrom] = useState(null);
  const [priceTo, setPriceTo] = useState(null);
  const [color, setColor] = useState(null);
  const [filterColor, setFilterColor] = useState([]);
  const [size, setSize] = useState([]);
  const [triggerLocalStorage, setTriggerLocalStorage] = useState();
  const [whishlist, setWhishlist] = useState([]);
  const [recall, setRecall] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cn = queryParams.get("categorynav");
    setCategoryNav(queryParams.get("categorynav"));
    setStyleNav(queryParams.get("stylenav"));
    const filterSize = queryParams.get("size");
    if (filterSize) {
      setSize((prev) => [...prev, filterSize]);
    }

    const getproducts = async () => {
      try {
        const response = await axios.get(URI + "/productList");
        if (response.status === 200 || response.status === 201) {
          setProductList(response.data);
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
            // Assuming response is the response object from your API call
            if (
              response.data &&
              response.data.styleList &&
              response.data.styleList.length > 0
            ) {
              setStyleList(response.data.styleList[0].style); // Accessing the style from the first element in styleList
              setPosters(response.data.styleList[0].posters); // Accessing the posters from the first element in styleList
            }

            console.log(response.data.styleList[0].posters);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    getproducts();
  }, [location.search]); // Only run once when the component mounts

  const handleWhishlist = async (productDetails) => {
    const product = { productId: productDetails.id };
    try {
      const response = await axios.post(`${URI}/auth/whishlist`, product);
      if (response.status === 200 || response.status === 201) {
        console.log(response);
        // alert("product successfully added to wishlist");
        setRecall(!recall);
      } else if (response.status(400)) alert(response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate(
          `/login/?categorynav=${productDetails.category}&stylenav=${productDetails.style}&pagetype=productpage`
        );
      } else if (error.response && error.response.status === 404) {
        alert(error.response.data.message);
        navigate(
          `/login/?categorynav=${productDetails.category}&stylenav=${productDetails.style}&pagetype=productpage`
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };
  useEffect(() => {
    const getwhishlist = async () => {
      try {
        const response = await axios.get(`${URI}/auth/getWhishlist`);
        if (response.status === 200 || response.status === 201) {
          setWhishlist(
            () =>
              response.data.cart ?
              response.data.cart
                .filter((w) => w.productId) // Filter items that have a productId
                .map((w) => w.productId) : []// Extract only the productId
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

    getwhishlist();
  }, [recall]);

  useEffect(() => {
    const fp = productList.filter((product) => product.style === stylenav);
    setFilteredProduct(fp);
    const ff = fp.flatMap((product) => product.colors).flat();
    const uniqueArray = Array.from(
      new Map(
        ff.map((obj) => [JSON.stringify(obj), obj]) // Using JSON.stringify to create a unique string for each object
      ).values()
    );
    setColor(uniqueArray);
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
    //   const id = e.target.id;
    //   if (id == "pricefrom") {
    //     if (priceFrom > 0) {
    //       const pricefilter = filteredProduct.filter((product) => {
    //         return product.price > e.target.value;
    //       });
    //       setFilteredProduct(pricefilter);
    //     }
    //   }
  };
  console.log(whishlist);
  return (
    <div className="h-screen w-screen relative ">
      <Header />
      <div className="h-[5%] w-full flex justify-start items-center">
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
                      category.style.map((style, index) => (
                        <li
                          key={style.style}
                          className="px-4 py-2 cursor-pointer"
                          onClick={() => {
                            handleStyleNav(category.category, style.style);
                          }}
                        >
                          {style.style}
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
      <main className=" h-[80%] w-full  overflow-y-auto scrollbar-hidden ">
        <div className="aspect-[16/9] bg-red-200">
          {posters && (
            <img
              src={`data:image/png;base64,${posters[0]}`}
              className="h-full w-full object-cover"
            />
          )}
        </div>
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
                ? styleList.map((s, index) => {
                    return (
                      <li
                        key={index}
                        className={` min-w-max ${
                          stylenav === s.style ? "hidden" : ""
                        } lg:text-xl`}
                        onClick={() => {
                          handleStyleNav(categorynav, s.style);
                        }}
                      >
                        {s.style}
                      </li>
                    );
                  })
                : console.log("nok")}
            </ul>
          </div>
        </div>

        <div className="relative min-h-max flex w-full  flex  justify-start ">
          <div
            className={`max-h-max w-[20%] md:block ${
              isOpen
                ? "xsm:absolute xsm:w-[80%] md:relative md:w-[20%]  xsm:block"
                : "xsm:hidden"
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
                    onChange={(e) => {
                      setPriceFrom(e.target.value);
                    }}
                  ></input>
                  to
                  <input
                    id="priceto"
                    type="number"
                    className="w-[50%]"
                    onChange={(e) => {
                      if (e.target.value) setPriceTo(e.target.value);
                      else setPriceTo(null);
                    }}
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
              <div className=" flex gap-2 flex-wrap max-h-max w-full py-4">
                {isSizeOpen &&
                  styleList.map((st) => {
                    return (
                      st.style === stylenav &&
                      st.sizes.map((sty, index) => (
                        <div
                          className={`border-2 border-gray-300 max-h-max max-w-max py-2 px-4 ${
                            size.includes(sty) ? "bg-red-400 text-white" : ""
                          } rounded md:text-base xsm:text-xs flex flex-wrap cursor-pointer `}
                          onClick={() => {
                            size.includes(sty)
                              ? setSize(() => size.filter((s) => s !== sty))
                              : setSize((prev) => [...prev, sty]);
                          }}
                        >
                          {sty}
                        </div>
                      ))
                    );
                  })}
              </div>
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
              {isColorOpen && (
                <div className="flex flex-wrap gap-2">
                  {color?.length > 0
                    ? color.map((color, index) => (
                        <img
                          key={index}
                          onClick={() =>
                            filterColor.includes(color.color)
                              ? setFilterColor(() =>
                                  filterColor.filter((s) => s !== color.color)
                                )
                              : setFilterColor((prev) => [...prev, color.color])
                          }
                          src={`data:image/png;base64,${color.image}`}
                          className={`h-12 w-12 object-cover rounded border-4 cursor-pointer ${
                            filterColor.includes(color.color)
                              ? "border-green-500 "
                              : "border-white"
                          }`}
                          alt="Color Image"
                        />
                      ))
                    : "colors not available"}
                </div>
              )}
            </div>
            <hr></hr>
          </div>
          <div className="relative min-h-max md:w-[80%] xsm:w-full grid grid-cols-2 lg:grid-cols-4 gap-4 p-2">
            {filteredProduct.length > 0
              ? filteredProduct.map((product, index) => {
                  // console.log(whishlist.includes(product.id))
                  if (
                    (priceFrom === null ||
                      (product.offer > 0
                        ? product.price -
                            (product.price / 100) * product.offer >
                          priceFrom
                        : product.price > priceFrom)) &&
                    (priceTo === null ||
                      (product.offer > 0
                        ? product.price -
                            (product.price / 100) * product.offer <
                          priceTo
                        : product.price < priceTo)) &&
                    (size.length === 0 ||
                      size.some((s) => product.sizes.includes(s))) &&
                    (filterColor.length === 0 ||
                      product.colors.some((c) => filterColor.includes(c.color)))
                  ) {
                    return (
                      <div
                        key={index}
                        className="relative overflow-hidden p-1 cursor-pointer hover:shadow-xl rounded z-0 w-full transition-transform duration-300 ease-in-out"
                        onClick={() => {
                          product.stock === "In Stock" &&
                            // navigate(`/productDetails?id=${product.id}`);
                            console.log(product)
                            navigate('/color', { state: { pro: product } });
                        }}
                      >
                        <div className="w-full h-full">
                          {product && product.stock === "Out Of Stock" ? (
                            <div className="absolute top-2 right-2 px-2 py-1 max-w-max bg-red-600 gap-2 xsm:text-xs md:text-base text-white flex items-center gap-1 rounded">
                              {product.stock}
                            </div>
                          ) : product.offer > 0 ? (
                            <div className="absolute top-2 right-2 bg-green-100 xsm:text-xs md:text-base text-gray-600 font-semibold max-w-max max-h-max p-2 rounded">
                              sale {product.offer}%
                            </div>
                          ) : null}

                          <div
                            className={`absolute top-2 left-2  px-2 py-1 max-w-max  gap-2 xsm:text-xs md:text-base text-white flex items-center gap-1 rounded `}
                          >
                            <IoHeart
                              id="index"
                              className={`text-3xl ${
                                whishlist.includes(product.id)
                                  ? "text-red-500"
                                  : "text-white"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWhishlist(product);
                              }}
                            />
                          </div>

                          {product.images.length > 0 ? (
                            <img
                              src={`data:image/png;base64,${product.images[0]}`}
                              className="object-cover w-full aspect-[1/1] rounded border-2 border-gray-300"
                              alt={`product-${index}`}
                            />
                          ) : (
                            <div className="h-[200px] w-full break-words flex items-center justify-center bg-gray-100">
                              No Images Found
                            </div>
                          )}

                          <div className="flex-grow min-h-24 flex flex-col gap-2 px-2 mt-4">
                            <p className="xsm:text-xsm md:text-base text-gray-500 font-semibold hover:text-blue-500">
                              {product && product.name.length > 30
                                ? `${product.name.slice(0, 30)}...`
                                : product
                                ? product.name
                                : "Unknown"}
                            </p>
                            <div className="flex gap-2 items-center">
                              {product && (
                                <>
                                  {product.offer > 0 && (
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
                          </div>
                        </div>
                      </div>
                    );
                  }
                  //  return (<div
                  //     key={index}
                  //     className="absolute overflow-hidden p-1 cursor-pointer hover:shadow-xl h-full rounded z-0 w-full transition-transform duration-300 ease-in-out justify-center items-center flex flex-col font-semibold text-lg"

                  //   >
                  //     <FaRegSadCry className="text-7xl text-yellow-400"/>
                  //     Products not available please try again later
                  //   </div>)
                })
              : ""}
          </div>
        </div>
        {/* <div className="min-h-max w-full  overflow-x-auto z-0 px-2">
          <h1 className="my-4">INSTRUCTIONS</h1>
          <ul className="ml-6 list-decimal xsm:text-sm flex flex-col gap-2 ">
            <li>
              <p>hw was your day?</p>
            </li>
            <li>Our Story</li>
            <li>Blog</li>
            <li>Privacy</li>
          </ul>
        </div> */}
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
