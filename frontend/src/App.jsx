import { useRef, useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import axios from "axios";
import Container from "./components/Container";
import "./index.css";
import Signup from "./login/SIgnup";
import Login from "./login/Login";
import Forgotpassword from "./login/Forgotpassword";
import Resetpassword from "./login/ResetPassword";
import Homepage from "./client/Homepage";
import ProductDetails from "./client/ProductDetails";
import Cart from "./client/Cart";
import OrderPage from "./client/OrderPage";
import AddressForm from "./client/AddressForm";
import PaymentPage from "./client/PaymentPage";
import ProductPage from "./client/ProductPage";
import ProfilePage from "./client/ProfilePage";
import DeliveryAddress from "./client/DeliveryAddress";
import Whishlist from "./client/Whishlist";
import UserOrders from "./client/UserOrders";
import OrderTracking from "./client/OrderTracking";
import ApparelColorPicker from "./client/ColorPicker"

const URI = "http://localhost:5000";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [stylenav, setStyleNav] = useState("");
  const [categorynav, setCategoryNav] = useState("");
  const [productList, setProductList] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);

  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to get current pathname

  // const getproducts = async () => {
  //   try {
  //     const response = await axios.get(URI + "/productList");
  //     if (response) {
  //       localStorage.setItem('productList',JSON.stringify(response.data));
  //       setProductList(response.data);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${URI}/auth/verify`);
      if (res.data.status) {
        navigate("/homepage");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // getCategory();
    // getproducts();
    // checkAuth();
  }, []);

  const handleMenuBarToggle = () => {
    console.log("ok");
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddAddress = (e, index, pageType) => {
    if (e.target.id === "addAddress") {
      navigate(`/addressform/?pageType=${pageType}`);
    } else {
      navigate(`/addressform/?index=${index}&pageType=${pageType}`);
    }
  };

  // const getCategory = async () => {
  //   try {
  //     const response = await axios.get(URI + "/category");
  //     if (response) {
  //       setCategoryList(...categoryList,response.data);
  //       localStorage.setItem("categoryList", JSON.stringify(...categoryList,response.data));
  //   }
  // }
  //   catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleCart = (
    e,
    productDetails,
    selectedSize,
    selectedColor,
    count
  ) => {
    if (e && e.target) {
      if (e.target.id === "plus") {
        count = count + 1;
      } else if (e.target.id === "minus") {
        count = count - 1;
      } else {
        count = 1;
      }
    } else {
      count = count || 1;
    }

    if (selectedSize && selectedColor && productDetails) {
      const formdata = {
        productDetails: productDetails.id,
        count: count,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
      };

      const addCart = async () => {
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        try {
          const response = await axios.post(
            `${URI}/auth/cart`,
            formdata,
            config
          );
          if (response.status === 200 || response.status === 201) {
            if (e.target.id === "buy") navigate("/cart");
            else alert("product added to cart successfully");
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status; // Get the status code
            const errorMessage = error.response?.data.message; // Get the error message
            console.error(`Error: ${errorMessage}, Status Code: ${statusCode}`);
            if (statusCode === 401) {
              alert("Please log in again to Place order");
              navigate("/login", {
                state: { productDetails, selectedSize, navigation: "cart" },
              });
            } else if (statusCode === 400) {
              console.log("Bad request. Please check your input.");
            }
          } else {
            console.error("Unexpected error:", error);
          }
        }
      };

      addCart();
    } else if (!selectedSize) {
      alert("please slect Size");
    } else if (!productDetails) {
      alert("an error occured to add products to cart please try again later");
    }
  };

  // useEffect(() => {
  //   // if (
  //   //   // location.pathname === "/admin/addproducts" ||
  //   //   // location.pathname === "/admin/categories" ||
  //   //   // location.pathname === "/admin/editproducts" ||
  //   //   location.pathname === "/homepage"
  //   //   // location.pathname === "/productpage"
  //   // ) {

  //   }
  // }, []);

  return (
    <>
      <div className="relative w-screen h-screen">
        <Routes>
          <Route
            path="/*"
            element={
              <Container
                handleMenuBarToggle={handleMenuBarToggle}
                isSidebarOpen={isSidebarOpen}
                categoryList={categoryList}
                productList={productList}
              />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login handleCart={handleCart} />} />
          <Route path="/color" element={<ApparelColorPicker />} />

          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route
            path="/auth/resetpassword/:token"
            element={<Resetpassword />}
          />
          <Route
            path="/"
            element={
              <Homepage
                categoryList={categoryList}
                stylenav={stylenav}
                handleCart={handleCart}
              />
            }
          />
          <Route
            path="/productpage"
            element={
              <ProductPage
                categoryList={categoryList}
                stylenav={stylenav}
                categorynav={categorynav}
                filteredProduct={filteredProduct}
                // handleWhishlist={handleWhishlist}
              />
            }
          />
          <Route
            path="/ProductDetails"
            element={
              <ProductDetails
                handleCart={handleCart}

                // countop={countop}
                // count={count}
              />
            }
          />
          <Route path="/cart" element={<Cart handleCart={handleCart} />} />
          <Route
            path="/orderpage"
            element={<OrderPage handleAddAddress={handleAddAddress} />}
          />
          <Route path="/Whishlist" element={<Whishlist />} />
          <Route path="/addressform" element={<AddressForm />} />
          <Route path="/paymentpage" element={<PaymentPage />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          <Route
            path="/deliveryaddress"
            element={<DeliveryAddress handleAddAddress={handleAddAddress} />}
          />
          <Route path="/userorders" element={<UserOrders />} />
          <Route path="/ordertracking/:orderId" element={<OrderTracking />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
