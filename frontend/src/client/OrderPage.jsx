import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiHome } from "react-icons/ci";
import { MdWorkOutline } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BiSolidOffer } from "react-icons/bi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import uandiLogo from "../assets/uandilogo.jpg";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import Header from "./Header";

const OrderPage = ({ handleAddAddress }) => {
  const [address, setAddress] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [bgSelected, setBgSelected] = useState("");
  const [changeAddress, setChangeAddress] = useState(false);
  const [orderSummary, setOrderSummary] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [subTotal, setSubTotal] = useState();
  const [addressOpen, setAddressOpen] = useState(true);
  const [orderSummarySend, setOrderSummarySend] = useState();
  const [isOrderSummary, setIsOrderSummary] = useState(true);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const index = "";

  const URI = "http://localhost:5000";
  const navigate = useNavigate();

  const handleexit = () => {
    navigate("/paymentpage", {
      state: { orderSummarySend, address, coupon, subTotal },
    });
  };

  const handle = (e) => {
    const id = e.target.id;
    if (id === "address") setAddressOpen(!addressOpen);
    else if (id === "ordersummary") setIsOrderSummary(!isOrderSummary);
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(`${URI}/orderpage/address`);
        setAddresses(response.data);
        if (response.data.length > 0) {
          setAddress(response.data[0]); // Set default address if exists
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${URI}/orderpage/productDetails`);
        setOrderSummary(response.data.cart);
        setOrderSummarySend(response.data.productDetails);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAddress();
    fetchProductDetails();
  }, []);

  useEffect(() => {
    let newTotal = 0;
    let newDiscount = 0;

    if (orderSummary.length > 0) {
      newTotal = orderSummary.reduce(
        (acc, p) => acc + p.product.price * p.count,
        0
      );
      newDiscount = orderSummary.reduce(
        (acc, p) => acc + ((p.product.price * p.product.offer) / 100) * p.count,
        0
      );
    }

    const subtotal = newTotal - newDiscount;

    setSubTotal(parseFloat(subtotal.toFixed(2)));
    setTotal(parseFloat(newTotal.toFixed(2)));
    setDiscount(parseFloat(newDiscount.toFixed(2)));
  }, [orderSummary]);

  return (
    <div className="h-screen w-screen ">
      <Header />

      <main className="relative h-[85%] max-w-full overflow-y-auto scrollbar-hidden md:px-8 xsm:px-4">
        {changeAddress && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[95%] max-w-max border-2 border-gray-300 p-6 bg-white shadow-lg rounded-lg z-10 overflow-y-auto bg-red-300  ">
            <div className="flex justify-between items-center ">
              <div className="font-bold text-blue-500 ">
                Select Delivery Address
              </div>
              <ImCross
                className="text-sm text-red-600 cursor-pointer"
                onClick={() => setChangeAddress(false)}
              />
            </div>

            {addresses.length > 0 ? (
              addresses.map((addr, index) => (
                <div
                  key={index}
                  onClick={() => setBgSelected(addr)}
                  className={` max-h-max max-w-max  p-4 ${
                    bgSelected === addr ? "bg-green-100" : ""
                  } adress-300 border-2 border-gray-400 my-4 rounded-lg hover:shadow-md cursor-pointer`}
                >
                  <div
                    className="relative flex items-center justify-end text-gray-500 gap-0.5"
                    onClick={(e) => {
                      handleAddAddress(e, index, "orderpage");
                    }}
                  >
                    <MdEdit className="text-xl cursor-pointer hover:text-blue-500 transition-colors duration-300" />
                  </div>

                  <div className="flex font-semibold mt-2">
                    <div>{addr.name}</div>
                    <div className="flex items-center text-blue-500 ml-12">
                      {addr.addressType === "Home" ? (
                        <CiHome className="text-gray-500" />
                      ) : (
                        <MdWorkOutline className="text-gray-500" />
                      )}
                      <span className="ml-1">{addr.addressType}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {`${addr.address}, ${addr.locality}, ${addr.landmark}, ${addr.city} - ${addr.pincode}`}
                  </div>
                  <div className="mt-2 font-bold">{addr.mobile}</div>
                </div>
              ))
            ) : (
              <div className="text-xl text-gray-500 flex justify-center items-center h-36">
                Please add an address
              </div>
            )}
            <div className="flex justify-end">
              <button
                className="max-h-max w-24 hover:shadow-lg p-2 rounded font-bold text-white bg-blue-500"
                onClick={() => {
                  setAddress(bgSelected);
                  setChangeAddress(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div
          id="address"
          onClick={handle}
          className="lg:w-[90%] xsm:w-full max-h-max font-semibold text-lg flex items-center m-2 justify-between "
        >
          Address <MdKeyboardArrowDown id="address" onClick={handle} />
        </div>
        {addressOpen && (
          <div className="relative h-16 lg:w-[90%] xsm:w-full flex items-center justify-end ">
            <button
              id="addAddress"
              className="absolute  border-2 rounded bg-blue-500 text-white p-2"
              onClick={(e) => {
                console.log(e.target.id);
                handleAddAddress(e, index, "orderpage");
              }}
            >
              Add address
            </button>
          </div>
        )}

        {addressOpen && addresses && addresses.length > 0 ? (
          <div className="max-h-max lg:w-[90%] xsm:w-full xsm:p-2 rounded border-2 border-gray-400 lg:px-8 lg:py-4">
            <div className="flex justify-between words-break">
              <h1 className="font-semibold text-lg my-2 text-blue-500">
                Delivery Address
              </h1>
              <button
                onClick={() => setChangeAddress(true)}
                className="border-2 border-gray-300 bg-yellow-500 min-w-max max-h-max p-2 text-white text-sm font-bold rounded"
              >
                Change
              </button>
            </div>

            <div className="flex font-semibold mt-4">
              <div>{addresses[0].name}</div> {/* Show first address */}
              <div className="flex items-center ml-12">
                {addresses[0].addressType === "Home" ? (
                  <CiHome />
                ) : (
                  <MdWorkOutline />
                )}
                {addresses[0].addressType}
              </div>
            </div>

            <div className="mt-2 text-gray-500">
              {`${addresses[0].address} ${addresses[0].locality} ${addresses[0].landmark} ${addresses[0].city}-${addresses[0].pincode}`}
            </div>

            <div className="max-h-max min-w-max mt-2 font-bold">
              {addresses[0].mobile}
            </div>
          </div>
        ) : (
          addressOpen && (
            <div className="text-xl text-gray-500 flex justify-center items-center h-36">
              Please add an address
            </div>
          )
        )}

        {addressOpen ? "" : <hr />}

        <div className="h-16 mt-4 lg:w-[90%] xsm:w-full border-2 border-gray-300 rounded flex items-center">
          <BiSolidOffer className="h-[75%] w-[25%]  text-green-800" />
          <div className="w-[60%]">
            <div>Welcome Coupon....</div>
            <div className="text-sm underline flex items-center">
              3 coupons available <MdOutlineKeyboardArrowRight />
            </div>
          </div>
          <div className="w-[20%]">
            <button>Apply</button>
          </div>
        </div>
        <div>
          <div
            id="ordersummary"
            onClick={(e) => {
              handle(e);
            }}
            className="lg:w-[90%] xsm:w-full max-h-max font-semibold text-lg mt-8 flex items-center m-2 justify-between"
          >
            Order Summary{" "}
            <MdKeyboardArrowDown
              id="ordersummary"
              onClick={(e) => {
                handle(e);
              }}
            />
          </div>
          <div className="lg:grid lg:grid-cols-3 h-full lg:w-[90%] ">
            {isOrderSummary ? (
              <div className="max-h-max max-w-full px-2 mt-8 mb-12 lg:col-start-1 lg:col-span-2">
                {orderSummary.length > 0 ? (
                  <table className="w-full lg:w-[90%] table-auto">
                    <thead>
                      <tr className="text-left">
                        <th className="p-2"></th>
                        <th className="p-2">Product</th>
                        <th className="p-2">Quantity</th>
                        <th className="p-2 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderSummary.map((p, index) => {
                        const product = p.product;
                        if (!product) return null;

                        return (
                          <tr key={index} className="border-t">
                            {/* Product Image */}
                            <td className="p-2 w-[40%]">
                              <img
                                src={`data:image/png;base64,${product.images[0]}`}
                                alt="img"
                                className="xsm:w-full xxsm:w-[40%] lg:w-[25%] aspect-square rounded"
                              />
                            </td>

                            {/* Product Details */}
                            <td className="p-2">
                              <div className="font-semibold text-sm break-words">
                                {product.name.length > 30
                                  ? `${product.name.substring(0, 30)}...`
                                  : product.name}
                              </div>
                              {product.offer > 0 && (
                                <p className="text-xs text-red-600 mt-1 flex items-center">
                                  {product.offer}% Off
                                </p>
                              )}
                            </td>

                            {/* Quantity - Left aligned */}
                            <td className="p-2 text-left text-gray-500 text-xs">
                              Qty {p.count}
                            </td>

                            {/* Price and Offer */}
                            <td className="p-2 text-right">
                              <p
                                className={`${
                                  product.offer > 0
                                    ? "line-through text-xs"
                                    : ""
                                }`}
                              >
                                ₹{(product.price * p.count).toFixed(2)}
                              </p>
                              {product.offer > 0 && (
                                <div className="font-semibold text-xs text-green-800 mt-1">
                                  ₹
                                  {(
                                    product.price * p.count -
                                    ((p.product.price * p.product.offer) /
                                      100) *
                                      p.count
                                  ).toFixed(2)}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="break-words">
                    Add some products to your cart
                  </div>
                )}
              </div>
            ) : (
              <div></div>
            )}

            {/* Summary Section */}
            <div className="max-h-max w-full lg:w-full lg:col-start-3 lg:col-span-1 ">
              <div className="max-h-max max-w-max shadow-md rounded ml-auto p-8 lg:mt-8">
                <div className="w-full p-4 h-12 flex gap-4 items-center justify-end">
                  <p className="text-base">
                    Price({orderSummary.length}{" "}
                    {orderSummary.length > 1 ? " items" : " item"})
                  </p>
                  <p className="text-base"> {total}</p>
                </div>
                <div className="w-full p-4 h-12 flex gap-4 items-center justify-end">
                  <p className="text-base">Delivery Charge</p>
                  <p className="text-base"> free</p>
                </div>
                {discount > 0 ? (
                  <div className="w-full p-4 h-12 flex gap-4 items-center justify-end">
                    <p className="text-base">Discount</p>
                    <p className="text-base">{discount}</p>
                  </div>
                ) : (
                  ""
                )}
                <div className="w-full p-4 h-12 flex gap-4 items-center justify-end">
                  <p className="font-bold text-lg">Total</p>
                  <p className="font-bold text-lg"> {subTotal}</p>
                </div>
                {isOrderSummary ? "" : <hr />}
              </div>
              <div className="w-full h-24 mt-4 flex justify-end items-center">
                <button
                  className="max-w-max aspect-[4/1] border-2 border-gray-300 bg-orange-500 rounded text-white p-4"
                  onClick={handleexit}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderPage;
