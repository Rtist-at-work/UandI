import React, { useEffect, useState } from "react";
import uandiLogo from "../assets/uandilogo.jpg";
import { CgProfile } from "react-icons/cg";
import { MdOutlineShoppingCart, MdDelete } from "react-icons/md";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = ({ handleCart }) => {
  const URI = "http://localhost:5000";

  const [cartProducts, setCartProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const navigate = useNavigate();

  // Function to calculate subtotal
  const calculateSubtotal = (cartProducts, productList) => {
    let subtotal = 0;
    cartProducts.forEach((cartProduct) => {
      const filteredProduct = productList?.find(
        (product) => cartProduct.product === product.id
      );
      if (filteredProduct) {
        const price = filteredProduct.price;
        subtotal += price * cartProduct.count;
      }
    });
    setSubTotal(subtotal);
  };

  // Fetch cart products and product list on initial render
  useEffect(() => {
    const getProductsAndCart = async () => {
      try {
        // Fetch the product list
        const productResponse = await axios.get(URI + "/productList");
        if (productResponse.status === 200 || productResponse.status === 201) {
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
    console.log(index)
    try {
      const productId = cartProducts[index]._id;
      console.log(productId)
      const updatedCart = [...cartProducts];
      updatedCart.splice(index, 1);
      setCartProducts(updatedCart);
      console.log(updatedCart)
      const response = await axios.put(`${URI}/auth/deleteCartProduct/${productId}`);
      console.group(response)

    } catch (err) {
      console.error(err);
    }
  };

  // Navigate to order page
  const handleOrder = () => {
    navigate("/orderpage");
  };

  return (
    <div className="h-screen w-screen">
      <header className="relative h-[15%] w-full bg-blue-300">
        <div className="h-[25%] w-full bg-pink-300 xsm:text-sm flex items-center justify-center">
          10% Discount on first purchase | Welcome
        </div>
        <div className="h-[75%] w-full bg-yellow-300 flex">
          <div className="h-full w-[30%] bg-pink-300 shrink-0">
            <img src={uandiLogo} alt="logo" className="h-full w-full" />
          </div>
          <div className="h-full w-[70%] shrink-0">
            <CgProfile className="absolute text-3xl right-4 top-1/2" />
            <MdOutlineShoppingCart className="absolute text-3xl right-16 top-1/2" />
          </div>
        </div>
      </header>

      <main className="h-[85%] w-full bg-red-100">
        <div className="h-full w-full flex flex-col gap-4">
          <h1 className="p-2">YOUR CART</h1>
          <div className="max-h-max w-full flex flex-col gap-4 p-2">
            {cartProducts.length > 0 ? (
              cartProducts.map((cartProduct, index) => {
                const filteredProduct = productList?.find(
                  (product) => cartProduct.product === product.id
                );

                if (!filteredProduct) return null;

                return (
                  <div
                    key={filteredProduct.id}
                    className="max-h-max w-full flex gap-2 justify-around"
                  >
                    <div className="h-32 w-32 bg-pink-900 shrink-0 rounded-md overflow-hidden">
                      {filteredProduct.images && filteredProduct.images.length > 0 ? (
                        <img
                          src={`data:image/png;base64,${filteredProduct.images[0]}`}
                          alt="product"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div>No Image</div>
                      )}
                    </div>

                    <div className="max-h-max w-[55%] shrink-0 break-words flex flex-row gap-2 justify-between flex-wrap">
                      <div className="sm:w-[50%] xsm:w-full flex flex-col gap-2">
                        <div className="flex justify-between">
                          <h1>{filteredProduct.name}</h1>
                          <MdDelete
                            onClick={() => deleteCartItem(index)}
                            className="text-2xl cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            id="minus"
                            className="h-6 w-6 flex items-center justify-center bg-red-300"
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
                          <div>{cartProduct.count}</div>
                          <button
                            id="plus"
                            className="h-6 w-6 flex items-center justify-center bg-red-300"
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
                        <p>Color:</p>
                        <p>Size: {cartProduct.selectedSize}</p>
                      </div>
                      <p className="w-[50%]">Rs.{filteredProduct.price}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>Add items</div>
            )}
          </div>

          <div className="h-[10%] w-full flex items-center justify-end p-4">
            <p>SUBTOTAL: Rs.{subTotal}</p>
          </div>

          <div className="w-full flex justify-center">
            <button
              className="w-[90%] h-12 border-2 border-gray-400 bg-gray-400 mx-auto"
              onClick={handleOrder}
            >
              CHECK OUT
            </button>
          </div>

          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Cart;
