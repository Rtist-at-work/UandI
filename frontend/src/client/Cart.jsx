import React, { useEffect, useState } from "react";
import uandiLogo from "../assets/uandilogo.jpg";
import { CgProfile } from "react-icons/cg";
import { MdOutlineShoppingCart, MdDelete } from "react-icons/md";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

const Cart = ({ handleCart }) => {
  const URI = "http://localhost:5000";

  const [cartProducts, setCartProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  // Function to calculate subtotal
  const calculateSubtotal = (cartProducts, productList) => {
    let subtotal = 0;
    let discount = 0;
    cartProducts.forEach((cartProduct) => {
      const filteredProduct = productList?.find(
        (product) => cartProduct.product === product.id
      );
      if (filteredProduct) {
        const price = filteredProduct.price;
        discount =
          discount +
          (filteredProduct.price / 100) *
            filteredProduct.offer *
            cartProduct.count;
        subtotal += price * cartProduct.count;
      }
    });
    setDiscount(discount);
    setSubTotal(subtotal);
  };

  // Fetch cart products and product list on initial render
  useEffect(() => {
    const getProductsAndCart = async () => {
      try {
        // Fetch the product list
        const productResponse = await axios.get(URI + "/productList");
        if (productResponse.status === 200 || productResponse.status === 201) {
          console.log(productResponse);
          setProductList(productResponse.data);
        }

        // Fetch the cart
        const cartResponse = await axios.get(`${URI}/auth/getCart`);
        if (cartResponse.status === 200 || cartResponse.status === 201) {
          setCartProducts(cartResponse.data.cart);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getProductsAndCart();
  }, []);

  // Recalculate subtotal whenever cartProducts or productList changes
  useEffect(() => {
    if (cartProducts.length > 0 && productList.length > 0) {
      calculateSubtotal(cartProducts, productList);
    }
  }, [cartProducts, productList]);

  // Update cart product count
  const countop = (e, index, count) => {
    const id = e.target.id;
    const updatedCartProducts = [...cartProducts];

    if (id === "plus") {
      updatedCartProducts[index].count = count + 1;
    } else if (id === "minus" && count > 0) {
      updatedCartProducts[index].count = count - 1;
    }

    setCartProducts(updatedCartProducts);
  };

  // Delete item from cart
  const deleteCartItem = async (index) => {
    console.log(index);
    try {
      const productId = cartProducts[index]._id;
      console.log(productId);
      const updatedCart = [...cartProducts];
      updatedCart.splice(index, 1);
      setCartProducts(updatedCart);
      console.log(updatedCart);
      const response = await axios.put(
        `${URI}/auth/deleteCartProduct/${productId}`
      );
      console.group(response);
    } catch (err) {
      console.error(err);
    }
  };

  // Navigate to order page
  const handleOrder = () => {
    navigate("/orderpage");
  };

  return (
    <div className="h-screen w-screen overflow-auto scrollbar-hidden">
      <Header />
      <main className="h-full w-full md:grid md:grid-cols-3 mb-4">
        <div className="max-h-max md:col-start-1 md:col-span-2">
          <h1 className="p-4">YOUR CART</h1>
          {cartProducts.length > 0 ? (
            <table className="max-h-max w-full">
              <thead>
                <tr className="bg-gray-200 w-full">
                  <th className="p-2 w-[40%]">Product</th>
                  <th className="p-2 w-[15%] xsm:hidden xxsm:table-cell ">
                    Size
                  </th>
                  <th className="p-2 w-[10%] xsm:hidden xxsm:table-cell ">
                    Quantity
                  </th>
                  <th className="p-2  w-[20%] ">Price</th>
                </tr>
              </thead>
              <tbody>
                {cartProducts.map((cartProduct, index) => {
                  const filteredProduct = productList?.find(
                    (product) => cartProduct.product === product.id
                  );

                  if (!filteredProduct) return null;

                  return (
                    <tr key={filteredProduct.id} className="border-b">
                      <td className="p-2 flex items-center gap-4 w-full ">
                        {filteredProduct.images &&
                        filteredProduct.images.length > 0 ? (
                          <img
                            src={`data:image/png;base64,${filteredProduct.images[0]}`}
                            alt="product"
                            className="h-20 w-20 border-2 border-gray-300 shadow-md rounded"
                          />
                        ) : (
                          <div>No Image</div>
                        )}
                        <div className="flex flex-col gap-2">
                          {/* Product Name */}
                          <h1 className="font-thin text-base xsm:text-md ">
                            {filteredProduct.name}
                          </h1>

                          {/* Product Color */}
                          <p className="text-sm text-gray-600">
                            Color: {cartProduct.selectedColor}
                          </p>

                          {/* Quantity Controls (Visible above xxsm, hidden below) */}
                          <div className="flex items-center gap-4 xxsm:hidden">
                            <button
                              id="minus"
                              className="h-6 w-6 flex items-center justify-center bg-red-300 rounded"
                              onClick={(e) => {
                                handleCart(
                                  e,
                                  filteredProduct,
                                  cartProduct.selectedSize,
                                  cartProduct.count
                                );
                                countop(e, index, cartProduct.count);
                              }}
                            >
                              -
                            </button>
                            <div className="text-sm font-medium">
                              {cartProduct.count}
                            </div>
                            <button
                              id="plus"
                              className="h-6 w-6 flex items-center justify-center bg-red-300 rounded"
                              onClick={(e) => {
                                handleCart(
                                  e,
                                  filteredProduct,
                                  cartProduct.selectedSize,
                                  cartProduct.count
                                );
                                countop(e, index, cartProduct.count);
                              }}
                            >
                              +
                            </button>
                          </div>

                          {/* Product Size (Visible above xxsm, hidden below) */}
                          <p className="text-sm text-gray-600 xxsm:hidden">
                            Size: {cartProduct.selectedSize}
                          </p>
                        </div>
                      </td>

                      {/* Size */}
                      <td className="p-2 text-center xxsm:table-cell xsm:hidden ">
                        {cartProduct.selectedSize}
                      </td>

                      {/* Quantity */}
                      <td className="p-2 xsm:hidden xxsm:table-cell ">
                        <div className="flex items-center justify-between">
                          <button
                            id="minus"
                            className="h-6 w-6 flex items-center justify-center bg-red-300"
                            onClick={(e) => {
                              handleCart(
                                e,
                                filteredProduct,
                                cartProduct.selectedSize,
                                cartProduct.selectedColor,
                                cartProduct.count
                              );
                              countop(e, index, cartProduct.count);
                            }}
                          >
                            -
                          </button>
                          <div>{cartProduct.count}</div>
                          <button
                            id="plus"
                            className="h-6 w-6 flex items-center justify-center bg-red-300"
                            onClick={(e) => {
                              handleCart(
                                e,
                                filteredProduct,
                                cartProduct.selectedSize,
                                cartProduct.selectedColor,
                                cartProduct.count
                              );
                              countop(e, index, cartProduct.count);
                            }}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="p-2 text-center">
                        <div className="flex flex-col">
                          <p
                            className={`${
                              filteredProduct.offer > 0
                                ? "line-through text-sm"
                                : "text-md"
                            }`}
                          >
                            Rs.{filteredProduct.price}
                          </p>
                          {filteredProduct.offer > 0 && (
                            <p className="text-green-700  text-md">
                              Rs.
                              {(
                                filteredProduct.price -
                                (filteredProduct.price / 100) *
                                  filteredProduct.offer
                              ).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      {/* <td className="p-2 text-right">
                    <MdDelete
                      onClick={() => deleteCartItem(index)}
                      className="text-2xl cursor-pointer text-red-500"
                    />
                  </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center p-4">Add items</div>
          )}
        </div>
        <div className=" md:col-start-3 md:col-span-1 md:h-full md:w-full py-8 md:flex md:flex-col md:items-center md:justify-end">
          <div className="max-h-max max-w-max md:mx-auto p-6 rounded-md bg-white ml-auto shadow-md mb-8">
            <div className="w-full p-4 h-12 flex gap-4 items-center justify-end">
              <p className="text-base">
                Price ({cartProducts.length}{" "}
                {cartProducts.length > 1 ? " items" : " item"})
              </p>
              <p className="text-base"> {subTotal}</p>
            </div>
            <div className="w-full p-4 h-12 flex gap-4 items-center justify-end">
              <p className="text-base">Delivery Charge</p>
              <p className="text-base"> free</p>
            </div>
            {discount > 0 ? (
              <div className="w-full p-4 h-12 flex gap-4 items-center justify-end">
                <p className="text-base">Discount</p>
                <p className="text-base">{(discount).toFixed(2)}</p>
              </div>
            ) : (
              ""
            )}
            <div className="w-full p-4 h-12 flex gap-4 items-center justify-end">
              <p className="font-bold text-lg">Total</p>
              <p className="font-bold text-lg"> {subTotal - discount}</p>
            </div>
          </div>
          <div className="w-full flex justify-center col-start-3 col-span-1 mt-4 mb-8">
            <button
              className="w-[90%] h-12 border-2 border-gray-400 bg-gray-400 lg:mx-auto"
              onClick={handleOrder}
            >
              CHECK OUT
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
