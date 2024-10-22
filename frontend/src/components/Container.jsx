import React, { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Homepage from "./Homepage";
import AddProducts from "./AddProducts";
import EditProduct from "./EditProduct";
import Categories from "./Categories";
import Banners from "./banners/AllBanners";
import Orderlist from "./Orderlist";
import { useRef, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ProductPage from "./ProductPage";
import StylesPage from "./StylesPage";


const Container = ({ handleMenuBarToggle, isSidebarOpen }) => {
  const URI = "http://localhost:5000";

  const [filteredProduct, setFilteredProduct] = useState();
  const [catId, setCatId] = useState();
  const [editId, setEditId] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [categoryList,setCategoryList] = useState([]);
  const [productList,setProductList] = useState([]);

  useEffect(()=>{
    const cl = localStorage.getItem('categoryList');
    const pl = localStorage.getItem('productList');
    console.log(JSON.parse(pl));
    const cat = JSON.parse(cl)
    setCategoryList(cat)
    setProductList(JSON.parse(pl))
     },[]);
  

  // const handleStyles = (e) => {
  //   console.log(e.target.id)
  //   const id = e.target.id;
  //   setCatId(id);
  //   hs(id);
  // };



  useEffect(() => {
    if (location.pathname === "/admin/stylespage") {
      hs(catId);
    }
  }, [catId, location.pathname]);

  // useEffect(() => {
  //   if (location.pathname === '/productpage'||location.pathname ==='/categories'||location.pathname ==='/editproducts') {
  //     handleproductlist(ei);
  //   }
  // }, [location.pathname]);

  const handleproductedit = (p) => {
    navigate(`/admin/editproducts/?editId=${p}`);
    // setEditId(p);
  };

  return (
    <div className="absolute  h-[100%] w-[100%]  flex flex-row">
      <div className="relative  w-[0%] h-[100%] bg-pink-700 opacity-0">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          ref={sidebarRef}
          handleMenuBarToggle={handleMenuBarToggle}
        />
      </div>

      <div className=" relative h-[100%] w-[100%]">
        <Header
          handleMenuBarToggle={handleMenuBarToggle}
          isSidebarOpen={isSidebarOpen}
        />
        <Routes>
          <Route path="/admin/homepage" element={<Homepage />} />
          <Route
            path="/admin/addproducts"
            element={<AddProducts URI={URI} />}
          />
          <Route
            path="/admin/editproducts"
            element={
              <EditProduct
                
                URI={URI}
              />
            }
          />
          <Route path="/admin/banners" element={<Banners />} />
          <Route
            path="/admin/categories"
            element={
              <Categories
                URI={URI}
              />
            }
          />
          <Route
            path="/admin/stylespage"
            element={
              <StylesPage
                URI={URI}
                productList={productList}                
              />
            }
          /> 
          <Route path="/admin/orderlists" element={<Orderlist/>} />
          <Route
            path="/admin/productpage"
            element={
              <ProductPage
                filteredProduct={filteredProduct}
                handleproductedit={handleproductedit}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Container;