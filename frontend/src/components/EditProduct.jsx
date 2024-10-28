import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { TbBookUpload } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import Footer from "./mobile components/Footer";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const EditProduct = ({ URI }) => {
  const uploadRef = useRef(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [category, setCategory] = useState();
  const [description, setDescription] = useState();
  const [offer, setOffer] = useState();
  const [style, setStyle] = useState();
  const [size, setSize] = useState([]);
  const [isCategory, setIsCategory] = useState({});
  const [stockStatus, setStockStatus] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [images, setImages] = useState([]);
  const [id, setId] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const [editId, setProductDetails] = useState(location.state?.product);

  useEffect(() => {
    setName(editId.name);
    setPrice(editId.price);
    setCategory(editId.category);
    setDescription(editId.description);
    setOffer(editId.offer);
    setStockStatus(editId.stock);
    setStyle(editId.style);
    setSize(editId.sizes);
    setImages(editId.images);
    console.log(editId.images);
    setId(editId._id);

    const getCategory = async () => {
      try {
        const response = await axios.get(`${URI}/category`);
        console.log(response);
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

  const handleButtonClick = () => {
    uploadRef.current.click();
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const imageUrlsPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result.split(",")[1]; // Get Base64 string after the comma
            resolve(base64String); // Resolve the promise with the Base64 string
          };
          reader.onerror = reject; // Reject the promise on error
          if (file) {
            reader.readAsDataURL(file); // Read the file as a data URL
          }
        });
      });
      // Wait for all promises to resolve
      Promise.all(imageUrlsPromises)
        .then((base64Strings) => {
          setImages((prevImages) => [...prevImages, ...base64Strings]);
          console.log(base64Strings); // All Base64 strings
        })
        .catch((error) => {
          console.error("Error reading files:", error);
        });
    }
  };

  console.log(images);
  const validateForm = () => {
    if (
      !name ||
      !price ||
      !category ||
      offer.length === 0 ||
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
    Array.from(images).forEach((image) => {
      console.log(image);
      formData.append("images", image);
    });

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await axios.put(
        `${URI}/editproducts/${id}`,
        formData,
        config
      );
      if (response.status === 200 || response.status === 201) {
        setName("");
        setPrice("");
        setOffer("");
        setStockStatus("");
        setSize([]);
        setCategory("");
        setDescription("");
        setImages([]);
        alert("Product added successfully");
        navigate(`/admin/productpage?stylenav=${editId.style}`);
      }
    } catch (err) {
      console.log("Error adding product:", err);
    }
  };
  return (
    <div className="absolute  h-[90%] w-full rounded-md shadow-md">
      <div className="relative xsm:h-[95%] md:h-full w-[100%]  overflow-hidden scrollbar-hidden p-2">
        <header className="flex justify-between items-center px-4">
          <h1 className="text-xl font-bold xsm:text-base">EDIT PRODUCT</h1>
          <button className="mr-[5%] max-w-max max-h-max px-4 p-2 bg-red-500 hover:shadow-md cursor-pointer rounded-s-full font-semibold text-white rounded-e-full">
            Delete
          </button>
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
              className="h-12 rounded border-2 border-gray-300 px-4 bg-blue-50 outline-blue-500"
              onChange={handleChange}
              value={name}
            />
            <label htmlFor="price"> PRICE </label>
            <input
              type="number"
              id="price"
              name="Price"
              placeholder="Price"
              className="h-12 rounded border-gray-300 border-2 border-gray-300 px-4 bg-blue-50 outline-blue-500"
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
              className="h-12 rounded border-gray-300 border-2 border-gray-300 px-4 bg-blue-50 outline-blue-500"
              onChange={handleChange}
              value={offer}
            />
            <label htmlFor="category"> CATEGORY </label>
            <select
              id="category"
              name="Category"
              className="h-12 rounded border-2 border-gray-300 px-2 bg-blue-50 outline-blue-500"
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
              className="h-12 rounded border-2 border-gray-300 px-2 bg-blue-50 outline-blue-500"
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
                  checked={size.includes("6 month")}
                  type="checkbox"
                  onChange={(e) => {
                    handlesize(e);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-blue-50 outline-blue-500"
                />
                <span className="text-sm font-medium">In Stock</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="12 month"
                  checked={size.includes("12 month")}
                  onChange={(e) => {
                    handlesize(e);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-blue-50 outline-blue-500"
                />
                <span className="text-sm font-medium">In Stock</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="18 month"
                  checked={size.includes("18 month")}
                  onChange={(e) => {
                    handlesize(e);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-blue-50 outline-blue-500"
                />
                <span className="text-sm font-medium">In Stock</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="24 month"
                  checked={size.includes("24 month")}
                  onChange={(e) => {
                    handlesize(e);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-blue-50 outline-blue-500"
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
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-blue-50 outline-blue-500"
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
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-blue-50 outline-blue-500"
                />
                <span className="text-sm font-medium">Out Of Stock</span>
              </label>
            </div>

            <label htmlFor="description"> DESCRIPTION </label>
            <textarea
              id="description"
              name="Description"
              placeholder="Description"
              className="h-32 rounded overflow-y-auto border-2 border-gray-300 px-4 py-2 bg-blue-50 outline-blue-500"
              onChange={handleChange}
              value={description}
            />
            <label htmlFor="image"> IMAGE </label>
            <div className="flex p-2 h-24 w-full border-2 border-blue-500 rounded bg-blue-50 ">
              <input
                type="file"
                multiple
                id="image"
                name="Image"
                ref={uploadRef}
                className="opacity-0 ml-hidebuttons "
                onChange={handleImageUpload}
              />
              <TbBookUpload
                className="h-[100%] w-[10%] cursor-pointer"
                onClick={handleButtonClick}
              />
              <div className="flex h-[100%] w-[90%] overflow-x-auto  ">
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <div className=" relative h-[100%] aspect-[1/1] rounded ml-2 shrink-0 ">
                      <img
                        key={index}
                        src={`data:image/png;base64,${image}`}
                        alt={`Uploaded ${index}`}
                        className="h-full aspect-[1/1] rounded"
                      />
                      <MdDelete
                        className="absolute right-1 top-1 text-red-600 text-lg"
                        onClick={() => handleDel(index)}
                      />
                    </div>
                  ))
                ) : (
                  <p>No images uploaded</p>
                )}
              </div>
            </div>
            <button
              className="h-12 w-24 lg:font-medium text-sm items-bottom  rounded border-2 mx-auto"
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

export default EditProduct;
