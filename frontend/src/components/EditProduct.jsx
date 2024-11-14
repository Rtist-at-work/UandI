import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { TbBookUpload } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import Footer from "./mobile components/Footer";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const EditProduct = ({ URI }) => {
  const colorRef = useRef(null);

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
  const [colors, setColors] = useState([]);
  const [id, setId] = useState();
  const pid = new URLSearchParams(useLocation().search).get("id");

  const navigate = useNavigate();
  const location = useLocation();
  const [editId, setProductDetails] = useState(location.state?.product);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(`${URI}/category`);
        console.log("Category List Response:", response);
        if (response.status === 200 || response.status === 201) {
          setCategoryList(response.data.category);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getProduct = async () => {
      try {
        console.log("Fetching product with ID:", pid);
        const response = await axios.get(
          `${URI}/editproducts/getProducts/?editId=${pid}`
        );
        if (response.status === 200 || response.status === 201) {
          setName(response.data.product.name);
          setPrice(response.data.product.price);
          setCategory(response.data.product.category); // Set category here
          setDescription(response.data.product.description);
          setOffer(response.data.product.offer);
          setStockStatus(response.data.product.stock);
          setStyle(response.data.product.style);
          setSize(response.data.product.sizes);
          setImages(response.data.product.images);
          setColors(response.data.product.colors);
          
          setId(response.data.product._id);
        }
      } catch (err) {
        console.log(err);
        alert("An error occurred, please try again later!");
      }
    };

    // Load categories first, then the product
    getCategory().then(getProduct);
  }, [pid]);
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "name") setName(value);
    if (id === "price") setPrice(value);
    if (id === "offer") setOffer(value);
    if (id === "category") {
      setCategory(value);
    }
    if (id === "style") {
      setStyle(value);
      setSize([]);
    }
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
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${URI}/editproducts/deleteProducts`,
        {
          params: { editId: pid }, // Sending editId as a query parameter
        }
      );
      if (response.status === 200 || response.status === 201) {
        alert(response.data.message);
        navigate(`/admin/productpage/?stylenav=${style}`);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (category && categoryList.length > 0) {
      const filteredCategory = categoryList.filter(
        (cat) => cat.category.toLowerCase().trim(" ") === category.toLowerCase().trim(" ")
      );
      setIsCategory(filteredCategory);
    }
  }, [category, categoryList]);

  const handleButtonClick = (e) => {
    if (e.currentTarget.id === "color") colorRef.current.click();
    else if (e.currentTarget.id === "image") uploadRef.current.click();
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const isImageUpload = e.currentTarget.id === "image";
    const isColorUpload = e.currentTarget.id === "color";
  
    if (files.length > 0) {
      const imageUrlsPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result.split(",")[1]; // Get Base64 without prefix
            const colorKey = file.name.split(".")[0]; // Extract color name from filename
            resolve({ color: colorKey, image: base64String }); // Return object with color and image
          };
          reader.onerror = reject;
          if (file) {
            reader.readAsDataURL(file);
          }
        });
      });
  
      Promise.all(imageUrlsPromises)
        .then((processedImages) => {
          if (isImageUpload) {
            // Assuming setImages just stores plain Base64 strings
            setImages((prevImages) => [...prevImages, ...processedImages.map(img => img.image)]);
          } else if (isColorUpload) {
            // For color uploads, set in desired {color, image} format
            setColors((prevColors) => [...prevColors, ...processedImages]);
          }
        })
        .catch((error) => {
          console.error("Error reading files:", error);
        });
    }
  };
  

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

    const productData = {
      name,
      price,
      offer,
      stock: stockStatus,
      sizes: size,
      category,
      style,
      description,
      images, // Send Base64 images directly in the JSON payload
      colors
    };
  
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const response = await axios.put(
        `${URI}/editproducts/${id}`,
        productData,
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
        setColors([])
        alert("Product Edited successfully");
        navigate(`/admin/productpage/?stylenav=${style}`);
      }
    } catch (err) {
      console.log("Error adding product:", err);
    }
  };
  console.log(name,
    price,
    offer,
    stockStatus,
     size,
    category,
    style,
    description,
    images, // Send Base64 images directly in the JSON payload
    colors)
  return (
    <div className="absolute  h-[90%] w-full rounded-md shadow-md">
      <div className="relative xsm:h-[95%] md:h-full w-[100%]  overflow-hidden scrollbar-hidden p-2">
        <header className="flex justify-between items-center px-4">
          <h1 className="text-xl font-bold xsm:text-base">EDIT PRODUCT</h1>
          <button
            className="mr-[5%] max-w-max max-h-max px-4 p-2 bg-red-500 hover:shadow-md cursor-pointer rounded-s-full font-semibold text-white rounded-e-full"
            onClick={() => {
              handleDelete();
            }}
          >
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
              className="h-12 rounded border-2 border-gray-300 px-2"
              value={category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {categoryList.length ? (
                categoryList.map((category) => (
                  <option key={category._id} value={category.category}>
                    {category.category}
                  </option>
                ))
              )
               : (
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
                isCategory[0].style.map((style, index) => {
                  return <option key={index}>{style.style}</option>;
                })}
            </select>
            <label>SIZES</label>
            <div className="max-h-max w-full flex flex-wrap gap-4 px-4">
              {isCategory.length > 0 &&
                isCategory[0].style.map((styl, index) => {
                  return (
                    styl.style === style &&
                    styl.sizes.map((sty, ind) => (
                      <label className="flex items-center space-x-2">
                        <input
                          value={sty}
                          type="checkbox"
                          checked={size.includes(sty)}
                          onChange={(e) => {
                            handlesize(e);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium">{sty}</span>
                      </label>
                    ))
                  );
                })}
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
                onChange={(e) => {
                  handleImageUpload(e);
                }}
              />
              <TbBookUpload
                id="image"
                className="h-[100%] w-[10%] cursor-pointer"
                onClick={(e) => handleButtonClick(e)}
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
                        onClick={() => {
                          setImages(() =>
                            images.filter((_, image) => image != index)
                          );
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

            <div className="flex p-2 h-24 w-full border-2 border-blue-500 rounded bg-blue-50">
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
              <div className="flex h-[100%] w-[90%] overflow-x-auto ">
                {colors.length > 0 &&
                  colors.map((image, index) => (
                    <div
                      key={index}
                      className=" relative h-[100%] aspect-[1/1] rounded ml-2 shrink-0 "
                    >
                      <img
                        src={`data:image/png;base64,${image.image}`}
                        className="h-full aspect-[1/1] rounded"
                      />
                      <MdDelete
                        className="absolute right-1 top-1 text-red-600 text-lg"
                        onClick={() => {
                          setColors(() =>
                            colors.filter((_, image) => image != index)
                          );
                        }}
                      />
                    </div>
                  ))}
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
