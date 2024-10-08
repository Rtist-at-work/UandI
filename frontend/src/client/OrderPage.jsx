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

const OrderPage = ({ handleAddAddress }) => {
  const [address, setAddress] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [bgSelected, setBgSelected] = useState("");
  const [changeAddress, setChangeAddress] = useState(false);
  const [orderSummary, setOrderSummary] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [subTotal, setSubTotal] = useState();
  const [addressOpen, setAddressOpen] = useState(true);
  const [orderSummarySend,setOrderSummarySend] = useState()
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
        setOrderSummarySend(response.data.productDetails)
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
    <div className="h-screen w-screen">
      <header className="relative h-[15%] w-full bg-blue-300 ">
        <div className="h-[25%] w-full bg-pink-300 xsm:text-sm flex items-center justify-center">
          10% Discount on first purchase | Welcome
        </div>
        <div className=" h-[75%] w-full bg-yellow-300 flex ">
          <div className="h-full w-[30%] bg-pink-300 shrink-0">
            <img src={uandiLogo} alt="Logo" className="h-full w-full" />
          </div>
          <div className="h-full w-[70%]  shrink-0">
            <CgProfile className="absolute text-3xl right-4 top-1/2" />
            <Link to="/cart">
              <MdOutlineShoppingCart className="absolute text-3xl right-16 top-1/2" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative h-[85%] max-w-full overflow-y-auto">
        {changeAddress && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[95%] w-[90%] border-2 border-gray-300 p-6 bg-white shadow-lg rounded-lg z-10 overflow-y-auto">
            <div className="flex justify-between items-center">
              <div className="font-bold text-blue-500 ">
                Select Delivery Address
              </div>
              <ImCross
                className="text-sm text-red-600"
                onClick={() => setChangeAddress(false)}
              />
            </div>

            {addresses.length > 0 ? (
              addresses.map((addr, index) => (
                <div
                  key={index}
                  onClick={() => setBgSelected(addr)}
                  className={` max-h-max w-full mx-auto p-4 ${
                    bgSelected === addr ? "bg-green-100" : ""
                  } adress-300 border-2 border-gray-400 my-4 rounded-lg`}
                >
                  <div className="relative flex items-center justify-end text-gray-500 gap-0.5"
                  onClick={(e)=>{
                    handleAddAddress(e,index,"orderpage")
                  }}
                  >
                    <MdEdit className="text-xl cursor-pointer hover:text-blue-500 transition-colors duration-300" />
                  </div>

                  <div className="flex justify-between font-semibold mt-2">
                    <div>{addr.name}</div>
                    <div className="flex items-center text-blue-500">
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
                className="max-h-max w-24 border-2 border-black p-2 rounded font-bold bg-blue-300"
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
          className="w-[90%] max-h-max font-semibold text-lg flex items-center m-2 justify-between"
        >
          Address <MdKeyboardArrowDown id="address" onClick={handle} />
        </div>
        {addressOpen && (
          <div className="relative h-16 w-full flex items-center">
            <button
              id="addAddress"
              className="absolute right-4 border-2 rounded bg-blue-500 text-white p-2"
              onClick={(e) => {
                console.log(e.target.id);
                handleAddAddress(e, index, "orderpage");
              }}
            >
              Add address
            </button>
          </div>
        )}

        {addresses && addresses.length > 0 ? (
          <div className="max-h-max w-[90%] mx-auto p-2 border-2 border-gray-400">
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

            <div className="flex justify-between font-semibold mt-4">
              <div>{addresses[0].name}</div> {/* Show first address */}
              <div className="flex items-center ">
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

        <div className="h-16 mx-auto mt-4 w-[90%] border-2 border-gray-300 rounded flex items-center">
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
            className="w-[90%] max-h-max font-semibold text-lg flex items-center m-2 justify-between"
          >
            Order Summary{" "}
            <MdKeyboardArrowDown
              id="ordersummary"
              onClick={(e) => {
                handle(e);
              }}
            />
          </div>

          {isOrderSummary ? (
            <div className="max-h-max px-4 mt-2 mb-12">
              {orderSummary.length > 0 ? (
                orderSummary.map((p, index) => {
                  const product = p.product;
                  if (!product) return null; // Safeguard in case product is undefined or null

                  return (
                    <div
                      key={index}
                      className="relative mt-4 w-full flex flex-wrap gap-4 items-center "
                    >
                      <img
                        src={`data:image/png;base64,${product.images[0]}`}
                        alt="img"
                        className="h-12 w-12 rounded"
                      />
                      <div className="flex-1 flex flex-col gap-1 ml-2">
                        <div className="break-words font-semibold ">
                          {product.name.length > 30
                            ? `${product.name.substring(0, 30)}...`
                            : product.name}
                        </div>
                        <div className="text-gray-500 font-base">
                          Qty {p.count}
                        </div>
                      </div>
                      <div className="text-right flex gap-2 ">
                        <div
                          className={`${
                            product.offer > 0 ? "line-through text-sm" : ""
                          }`}
                        >
                          {product.price * p.count}
                        </div>
                        {product.offer > 0 ? (
                          <div>
                            {product.price * p.count -
                              ((p.product.price * p.product.offer) / 100) *
                                p.count}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="break-words">
                  Add some products to your cart
                </div>
              )}
            </div>
          ) : (
            <div></div>
          )}
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
          {isOrderSummary ? "" : <hr></hr>}
        </div>
        <div className="w-full h-24 mt-4 flex justify-end items-center px-4">
          <button
            className="h-12 w-32 border-2 border-gray-300 bg-orange-500 rounded text-white "
            onClick={handleexit}
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrderPage;
