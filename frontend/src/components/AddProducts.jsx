import React, { useState, useRef, useEffect } from "react";
import { TbBookUpload } from "react-icons/tb";
import axios from "axios";
import Footer from "./mobile components/Footer";
import { MdDelete } from "react-icons/md";

const AddProducts = ({ URI }) => {
  const imageRef = useRef(null);
  const colorRef = useRef(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [offer, setOffer] = useState(0);
  const [style, setStyle] = useState("");
  const [size, setSize] = useState([]);
  const [stockStatus, setStockStatus] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [isCategory, setIsCategory] = useState({});
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(`${URI}/category`);
        if (response.status === 200 || response.status === 201) {
          setCategoryList(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getCategory();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "name") setName(value);
    if (id === "price") setPrice(value);
    if (id === "offer") setOffer(value);
    if (id === "category") {
      setCategory(value);
    }
    if (id === "style") setStyle(value);
    if (id === "description") setDescription(value);
    console.log(offer);
  };

  const handleStock = (e) => {
    const { value } = e.target;
    setStockStatus(value);
  };

  const handlesize = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSize([...size, value]);
    }
    if (!checked) {
      const filteredSize = size.filter((s) => s !== value);
      setSize(filteredSize);
    }
  };

  useEffect(() => {
    if (category) {
      const filteredCategory = categoryList.filter(
        (cat) => cat.category === category
      );
      setIsCategory(filteredCategory);
    }
  }, [category]);

  const handleButtonClick = (e) => {
    const id = e.target.id;
    if (id === "image") {
      imageRef.current.click();
    }
    if (id === "color") {
      colorRef.current.click();
    }
  };

  const handleImageUpload = (e) => {
    let files = Array.from(e.target.files);
    if (files.length > 0) {
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      if (e.target.id === "image") {
        setImages([...images, ...imageUrls]);
      }
      if (e.target.id === "color") {
        setColors([...colors, ...imageUrls]); // Updated to use colors state
      }
    }
  };

  const handleDel = (index) => {
    const filteredimages = images.filter((_, ind) => ind !== index);
    setImages(filteredimages);

    // if(id==="color"){
    //   const filteredcolors = colors.filter((_, ind) => ind !== index);
    //   setColors(filteredcolors); // Updated to use colors state
    // }
  };
  const handleDelColors = (index) => {
    const filteredColors = colors.filter((_, ind) => ind !== index);
    setColors(filteredColors);

    // if(id==="color"){
    //   const filteredcolors = colors.filter((_, ind) => ind !== index);
    //   setColors(filteredcolors); // Updated to use colors state
    // }
  };

  const validateForm = () => {
    if (
      !name ||
      !price ||
      !category ||
      !offer ||
      !stockStatus ||
      size.length === 0 ||
      !description ||
      images.length === 0
    ) {
      alert("Please fill out all fields and upload at least one image.");
      return false;
    }
    return true;
  };
  const handleFormSubmission = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("offer", offer);
    formData.append("stock", stockStatus);
    Array.from(size).forEach((size) => formData.append("sizes", size));
    formData.append("category", category);
    formData.append("style", style);
    formData.append("description", description);
    Array.from(imageRef.current.files).forEach((file) =>
      formData.append("images", file)
    );
    Array.from(colorRef.current.files).forEach((file) =>
      formData.append("colors", file)
    );

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await axios.post(`${URI}/addproducts`, formData, config);

      // Clear form fields after success
      if (response.status === 200 || response.status === 201) {
        setSize([]);
        setName("");
        setPrice("");
        setOffer("");
        setStockStatus("");
        setStockStatus([]);
        setCategory("");
        setStyle("");
        setDescription("");
        setImages([]);
        alert("Product added successfully");
      }
    } catch (err) {
      // Check if the error message is related to the file format
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.error === "Give proper file format to upload"
      ) {
        alert("Give proper file format to upload");
      } else {
        console.log("Error adding product:", err);
        alert("An error occurred while adding the product");
      }
    }
  };

  return (
    <div className="absolute  h-[90%] w-full rounded-md shadow-md">
      <div className="relative xsm:h-[95%] md:h-full w-[100%]  overflow-hidden scrollbar-hidden p-2">
        <header className="text-xl mb-4 font-bold h-[5%] w-full ">
          ADD PRODUCT
        </header>
        <main className="relative px-8 h-[95%] w-full py-4 overflow-y-auto scrollbar-hidden">
          <form
            className="flex flex-col space-y-4 max-h-max w-full"
            onSubmit={handleFormSubmission}
          >
            <label htmlFor="name"> NAME </label>
            <input
              type="text"
              id="name"
              name="Name"
              placeholder="Product Name"
              className="h-12 rounded border-2 border-gray-300 px-4"
              onChange={handleChange}
              value={name}
            />
            <label htmlFor="price"> PRICE </label>
            <input
              type="number"
              id="price"
              name="Price"
              placeholder="Price"
              className="h-12 rounded border-gray-300 border-2 border-gray-300 px-4"
              onChange={handleChange}
              value={price}
            />
            <label htmlFor="price"> OFFER </label>
            <input
              type="number"
              id="offer"
              onWheel={(e) => e.target.blur()}
              name="offer"
              placeholder="offer %"
              className="h-12 rounded border-gray-300 border-2 border-gray-300 px-4"
              onChange={handleChange}
              value={offer}
            />
            <label htmlFor="category"> CATEGORY </label>
            <select
              id="category"
              name="Category"
              className="h-12 rounded border-2 border-gray-300 px-2"
              value={category}
              onChange={handleChange}
            >
              <option>Select category</option>
              {categoryList.length ? (
                categoryList.map((category) => (
                  <option key={category._id} value={category.category}>
                    {category.category}
                  </option>
                ))
              ) : (
                <div className="h-[10%] flex items-center rounded border-gray-300 border-2 border-gray-300">
                  No categories found
                </div>
              )}
            </select>
            <label htmlFor="category"> STYLE </label>
            <select
              id="style"
              name="style"
              className="h-12 rounded border-2 border-gray-300 px-2"
              value={style}
              onChange={handleChange}
            >
              <option>Select Style</option>
              {isCategory.length > 0 &&
                isCategory[0].style.map((style) => {
                  return <option key={style.key}>{style.value}</option>;
                })}
            </select>
            <label>SIZES</label>
            <div className="max-h-max w-full flex flex-wrap gap-4 px-4">
              <label className="flex items-center space-x-2">
                <input
                  value="6 month"
                  type="checkbox"
                  onChange={(e) => {
                    handlesize(e);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">In Stock</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="12 month"
                  onChange={(e) => {
                    handlesize(e);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">In Stock</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="18 month"
                  onChange={(e) => {
                    handlesize(e);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">In Stock</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="24 month"
                  onChange={(e) => {
                    handlesize(e);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">In Stock</span>
              </label>
            </div>
            <label>STOCK</label>
            <div className="max-h-max w-full flex flex-wrap gap-4 px-4">
              <label className="flex items-center space-x-2">
                <input
                  id="stock"
                  type="checkbox"
                  value="In Stock"
                  checked={stockStatus === "In Stock"}
                  onChange={handleStock}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">In Stock</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  id="stock 1"
                  type="checkbox"
                  value="Out Of Stock"
                  checked={stockStatus === "Out Of Stock"}
                  onChange={handleStock}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Out Of Stock</span>
              </label>
            </div>

            <label htmlFor="description"> DESCRIPTION </label>
            <textarea
              id="description"
              name="Description"
              placeholder="Description"
              className="h-32 rounded overflow-y-auto border-2 border-gray-300 px-4 py-2"
              onChange={handleChange}
              value={description}
            />
            <label htmlFor="image"> IMAGE </label>
            <div className="flex p-2 h-24 w-full border-2 border-gray-300 rounded">
              <input
                type="file"
                multiple
                id="image"
                name="Image"
                ref={imageRef}
                className="opacity-0 ml-hidebuttons "
                onChange={(e) => {
                  handleImageUpload(e);
                }}
              />
              <TbBookUpload
                id="image"
                className="h-[100%] w-[10%] cursor-pointer"
                onClick={(e) => {
                  handleButtonClick(e);
                }}
              />
              <div className="flex h-[100%] w-[90%] overflow-x-auto">
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <div className=" relative h-[100%] w-[35%] rounded ml-2 shrink-0 ">
                      <img
                        key={index}
                        src={image}
                        alt={`Uploaded ${index}`}
                        className="h-full w-full rounded"
                      />
                      <MdDelete
                        id="image"
                        className="absolute right-1 top-1 text-red-600 text-lg"
                        onClick={() => {
                          handleDel(index);
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p>No images uploaded</p>
                )}
              </div>
            </div>
            <label htmlFor="color"> COLORS </label>

            <div className="flex p-2 h-24 w-full border-2 border-gray-300 rounded">
              <input
                type="file"
                multiple
                id="color"
                name="color"
                ref={colorRef}
                className="opacity-0 ml-hidebuttons "
                onChange={(e) => {
                  handleImageUpload(e);
                }}
              />
              <TbBookUpload
                id="color"
                className="h-[100%] w-[10%] cursor-pointer"
                onClick={(e) => {
                  handleButtonClick(e);
                }}
              />
              <div className="flex h-[100%] w-[90%] overflow-x-auto">
                {colors.length > 0 ? (
                  colors.map((color, index) => (
                    <div className=" relative h-[100%] w-[35%] rounded ml-2 shrink-0 ">
                      <img
                        key={index}
                        src={color}
                        alt={`Uploaded ${index}`}
                        className="h-full w-full rounded"
                      />
                      <MdDelete
                        id="color"
                        className="absolute right-1 top-1 text-red-600 text-lg"
                        onClick={() => {
                          handleDelColors(index);
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p>No colors uploaded</p>
                )}
              </div>
            </div>
            <button
              className="h-12 w-24 lg:font-medium text-sm items-bottomrounded border-2  mx-auto"
              type="submit"
            >
              SAVE
            </button>
          </form>
        </main>
      </div>
      <footer className="h-[5%] w-full md:hidden xsm:block">
        <Footer />
      </footer>
    </div>
  );
};
//mmvml

export default AddProducts;
