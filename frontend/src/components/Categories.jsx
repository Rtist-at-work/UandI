import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./mobile components/Footer";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const Categories = ({  URI }) => {
  const [popup, setPopup] = useState(false);
  const [editpopup, setEditPopup] = useState(false);
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState("");
  const [style, setStyle] = useState([]);
  const [styletemp, setStyletemp] = useState([]);
  const [newStyle, setNewStyle] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [existanceAlert, setExistanceAlert] = useState(false);
  const [categoryExistance, setCategoryExistance] = useState([]);
  const [recall, setRecall] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(`${URI}/category`);
        if (response.status === 200 || response.status === 201) {
          setCategoryList(response.data);
          setPopup(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getCategory();
  }, [recall]);

  const styledelete = (index) => {
    const filteredstyle = style.filter((_, ind) => ind !== index);
    setStyle(filteredstyle);
  };

  const handleStyle = () => {
    if (!newStyle.trim("")) {
      alert("please enter valid style");
    } else if (
      style.includes(newStyle.toLowerCase()) ||
      styletemp.includes(newStyle.toLowerCase())
    ) {
      alert("style already created in this catgeory");
    } else {
      setStyle([...style, newStyle]); // Using Date.now() for a unique key
      setNewStyle("");
    }
  };

  const handleCategory = async (e) => {
    e.preventDefault();
    if (!category.trim("") || !style.length || style.includes("")) {
      return alert("please Enter atleast one category and style");
    }
    let stylelist = [];
    if (e.target.id === "create") {
      stylelist = style.map((s) => ({
        key: Date.now(),
        value: s.toLowerCase(),
      }));
    } else if (e.target.id === "update") {
      stylelist = [...style];
    }
    try {
      const catg = {
        category: category.toLowerCase(),
        style: stylelist,
      };
      let response;
      if (e.target.id === "create") {
        response = await axios.post(URI + "/createcategory", catg);
      }
      if (e.target.id === "update") {
        response = await axios.put(
          `${URI}/createcategory/update/${editId}`,
          catg
        );
      }

      if (response.status === 200) {
        alert(response.data.message);
        setExistanceAlert(false);
        setCategory();
        setCategoryExistance([]);
        setStyle([]);
        setEditPopup(false);
        setRecall(!recall);
      }
    } catch (err) {
      if(err.data.message) alert(err.data.message);
    }
  };

  const handleEditStyles = (e, index) => {
    const updatedValue = [...style];
    updatedValue[index].value = e.target.value;
    setStyle(updatedValue);
  };


  const handleDel = async (e, index) => {
      const delItem = e.currentTarget.id === "sty" ? "style" : "category";
      const delId = e.currentTarget.id === "sty" ? style[index]._id : editId;
      
      if (!delId) {
          alert("Error occurred. Please try again later.");
          return;
      }
      
      try {
          const response = await axios.delete(`${URI}/createcategory/delete/`, {
              params: { delItem, delId },
          });
          
          if (response.status === 200 || response.status === 201) {
              alert(response.data.message);
              
              // Remove the item from the array only if the deletion was successful
              if (delItem === "style") {
                  const updatedStyles = [...style]; // Create a shallow copy of the style array
                  updatedStyles.splice(index, 1); // Remove the specific item from the array
                  setStyle(updatedStyles); // Update the state with the modified array
              }
              else {
                setEditPopup(!editpopup);
                setRecall(!recall);
              }
          }
      } catch (err) {
          console.error(err.response ? err.response.data.message : err.message);
          if(err) alert(" Error occured please try again later")
      }
  };
  console.log(categoryList)
  
  return (
    <div className="absolute  h-[90%] w-full bg-white-800 rounded-md shadow-md">
      <main className="absolute h-[95%] w-[100%]  overflow-auto">
        <div className=" h-[10%] flex items-center  justify-between mb-8 mt-2 mx-auto">
          <h1 className="ml-2 text-xl font-bold ">CATEGORIES</h1>
          <button
            id="formopen"
            type="button"
            className="relative right-4 bg-blue-500 rounded lg:text-lg text-sm h-[70%] xsm:w-[20%] text-white font-semibold hover:shadow-md"
            onClick={(e) => {
              setPopup(!popup);
            }}
          >
            {" "}
            Create{" "}
          </button>
        </div>
        {categoryList.length > 0 &&
          categoryList.map((category, index) => {
            const capitalizedCategory =
              category.category.charAt(0).toUpperCase() +
              category.category.slice(1);

            return (
              <div
  id={capitalizedCategory}
  className="w-full sm:w-[75%] md:w-[50%] mx-auto mb-4 px-6 py-2 cursor-pointer rounded-lg bg-blue-300 shadow-md hover:bg-blue-400 transition-all duration-200"
>
  <div className="flex justify-between items-center">
    <div
      className="text-lg sm:text-xl md:text-2xl font-semibold break-words text-gray-700"
      onClick={() => {
        navigate(`/admin/stylespage/?category=${capitalizedCategory}`);
      }}
    >
      {capitalizedCategory}
    </div>
    <MdEdit
      className="h-6 w-6 text-gray-600 hover:text-gray-800 transition-colors duration-150 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        const st = categoryList.find(
          (data) => data.category === category.category
        );
        if (st) {
          setStyle(st.style);
        }
        let cl = [...categoryList];
        cl.splice(index, 1);
        cl = cl.flatMap((category) => [category.category]);
        setCategoryExistance(cl);
        setEditId(category._id);
        setCategory(category.category);
        setEditPopup(!editpopup);
      }}
    />
  </div>
</div>

            );
          })}
      </main>
      {popup && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[70%] w-[80%] max-w-lg max-h-[500px] border-2 border-gray-300 bg-red-200 p-4 rounded-lg">
          <form
            id="create"
            className="relative h-full w-full flex flex-col justify-between"
            onSubmit={(e) => {
              const hasCommonValues = style.some((value) =>
                styletemp.includes(value.toLowerCase())
              );
              if (hasCommonValues) {
                e.preventDefault();
                return alert("Entered style already in the list");
              }
              handleCategory(e);
            }}
          >
            <IoIosClose
              id="formclose"
              className="absolute top-2 right-2 h-8 w-8 cursor-pointer"
              onClick={(e) => {
                setCategory("");
                setNewStyle("");
                setStyle([]);
                setPopup(!popup);
              }}
            />

            <input
              type="text"
              required
              className="border-2 outline-blue-500 border-gray-300 h-12 w-full px-4 rounded-lg bg-blue-100"
              value={category}
              onChange={(e) => {
                const cl = categoryList.find(
                  (cat) =>
                    e.target.value.toLowerCase() === cat.category.toLowerCase()
                );
                if (cl) {
                  const styles = cl.style.flatMap((style) => style.value);
                  setStyletemp(styles);
                }
                setCategory(e.target.value);
              }}
              placeholder="Enter Category Name"
            />

            <div className="flex flex-col gap-4 mt-4">
              <input
                type="text"
                className={`border-2 h-12 outline-blue-500 ${
                  style.includes(newStyle.toLowerCase())
                    ? "border-red-500 outline-red-500"
                    : styletemp.includes(newStyle.toLowerCase())
                    ? "border-red-500 outline-red-500"
                    : "border-gray-300"
                } w-full px-4 rounded-lg bg-blue-100`}
                value={newStyle}
                onChange={(e) => {
                  setNewStyle(e.target.value);
                }}
                placeholder="Enter Style"
              />
              <button
                type="button"
                onClick={handleStyle}
                className="bg-blue-300 h-12 w-full rounded-lg border-2 border-gray-300"
              >
                Create Style
              </button>
            </div>
            <div className="border-2 border-gray-300 h-12 w-full px-4 gap-2 scrollbar-hidden rounded-lg bg-blue-100 flex items-center overflow-x-auto">
              {style.length > 0 &&
                style.map((item, index) => {
                  const styles = style.filter((st) => st !== item);
                  return (
                    <div
                      // key={item.key}
                      className={`h-8 text-sm max-w-max p-1 flex flex-shrink-0 items-center gap-2 border-2 ${
                        styles.includes(item.toLowerCase())
                          ? "border-red-500"
                          : styletemp.includes(item.toLowerCase())
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded`}
                    >
                      {item}
                      <IoIosClose
                        id={index}
                        className="text-lg cursor-pointer"
                        onClick={() => styledelete(index)}
                      />
                    </div>
                  );
                })}
            </div>

            <button
              type="submit"
              className="bg-blue-500 h-12 w-full rounded-lg border-2 border-gray-300 mt-4"
            >
              Create Category
            </button>
          </form>
        </div>
      )}
      {editpopup && style && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[70%] w-[80%] max-w-lg max-h-[500px] border-2 border-gray-300 bg-red-200 p-4 rounded-lg overflow-auto">
          <div className="w-full flex items-center justify-end mb-2">
            <IoIosClose
              id="formclose"
              className="relative h-8 w-8 cursor-pointer"
              onClick={() => {
                setExistanceAlert(false);
                setCategory(" ");
                setStyle([]);
                setEditPopup(!editpopup);                
              }}
            />
          </div>
          <div
            className={`relative flex items-center mb-4 border-2  ${
              categoryExistance.includes(category.toLowerCase())
                ? "border-red-500"
                : "border-gray-300"
            }  min-h-12 max-h-max w-full flex items-center justify-between rounded-lg bg-blue-100`}
          >
            <input
              type="text"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value); 
                if (categoryExistance.includes(e.target.value.toLowerCase())){
                  setExistanceAlert(!existanceAlert);
                } else {
                  setExistanceAlert(false);
                }
              }}
              className={`outline-none h-12 w-[80%] px-4 flex items-cente justify-between rounded-lg bg-blue-100`}
            />
            <MdDelete
              id="catg"
              className="h-6 w-[20%] right-4 top-1 text-red-600 cursor-pointer"
              onClick={(e) => {handleDel(e,category)}}
            />
          </div>

          {style.map((s, index) => {
            const fs = style.flatMap((style) => style.value);
            fs.splice(index, 1);
            return (
              <div
                id={s.value}
                className={`relative flex items-center mb-4 border-2 ${
                  fs.includes(s.value.toLocaleLowerCase())
                    ? "border-red-500"
                    : "border-gray-300"
                } min-h-12 max-h-max w-full flex items-center justify-between rounded-lg bg-blue-100`}
              >
                <input
                  type="text"
                  value={s.value}
                  onChange={(e) => {
                    fs.includes(e.target.value.toLowerCase())
                      ? setExistanceAlert(!existanceAlert)
                      : setExistanceAlert(false);
                    handleEditStyles(e, index);
                  }}
                  className="outline-none h-12 w-[80%] px-4 flex items-center justify-between rounded-lg bg-blue-100"
                />
                <MdDelete
                  id="sty"
                  className="h-6 w-[20%] right-4 top-1 text-red-600 cursor-pointer"
                  onClick={(e) => {handleDel(e,index)}}
                />
              </div>
            );
          })}
          <button
            className="h-12 w-24 mt-4 flex items-center justify-center mx-auto border-2 borzder-gray-300 font-bold rounded bg-blue-300"
            id="update"
            onClick={(e) => {
              if (existanceAlert) {
                alert("Entered fields are already Exists");
              } else {
                handleCategory(e);
              }
            }}
          >
            Submit
          </button>
        </div>
      )}

      <footer className="absolute bottom-0 flex items-center justify- gap-2 p-2  lg:h-[0] xsm:h-[5%] w-[100%] bg-red-100 lg:hidden">
        <Footer />
      </footer>
    </div>
  );
};

export default Categories;
