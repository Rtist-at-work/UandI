import { useEffect, useState } from "react";
import uandiLogo from "../assets/uandilogo.jpg";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

const Homepage = () => {
  const URI = "http://localhost:5000";

  const [categoryList, setCategoryList] = useState();
  const navigate = useNavigate();

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

  const handleStyleNav = (c, s) => {
    navigate(`/productpage?categorynav=${c}&stylenav=${s}`);
  };

  return (
    <div className="h-screen w-screen">
      <Header/>

      <main className="relative h-[85%] w-full overflow-y-auto overflow-x-hidden">
        <div className="h-6 lg:h-12 w-full flex bg-blue-300 gap-4 px-4 justify-around items-center z-10">
          {categoryList && categoryList.length > 0 ? (
            categoryList.map((category) => (
              <div key={category.category} className="relative group z-30">
                <a className="cursor-pointer text-gray-9">{category.category}</a>
                <ul className="absolute left-0 hidden group-hover:block bg-white border z-50 min-w-max rounded shadow-lg">
                  {category.style.length > 0 ? (
                    category.style.map((style) => (
                      <li
                        key={style.key}
                        className="px-4 py-2 cursor-pointer"
                        onClick={() => {
                          handleStyleNav(category.category, style.value);
                        }}
                      >
                        {style.value}
                      </li>
                    ))
                  ) : (
                    <div>Styles not found</div>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <div>No data</div>
          )}
        </div>

        {/* div1 */}
        <div className="bg-pink-300 w-full aspect-[2/1] z-10 p-4 flex">
          <div className="relative h-full min-w-max overflow-y-auto">
            <div className="h-[75%] aspect-square bg-blue-200"></div>
            <div className="absolute bottom-0 right-0 h-[50%] aspect-square bg-green-300"></div>
          </div>
        </div>
        {/* div2 */}
        <div className="w-full lg:aspect-[4/1] aspect-[4/2] bg-red-400">
          <div className="h-[15%] w-full flex items-center justify-center">
            <h1 className="xsm:text-sm">Shop by Age</h1>
          </div>
          <div className="h-[85%] w-full p-2 flex items-center justify-around overflow-x-auto py-2">
            <div className="relative h-full bg-blue-400 aspect-[1/1] ml-2 shrink-0 flex flex-col items-center justify-center gap-2 ">
              <div className=" w-[80%] aspect-[1/1] bg-yellow-300 rounded-full bg-white"></div>
              <p className="h-[10%]">10 years</p>
            </div>
            {/* Repeat similar blocks for other age groups */}
          </div>
        </div>
        {/* categories */}
        <div className="h-[70%] xxsm:h-[80%] sm:h-[90%] md:h-[100%] w-full p-2">
          <div className="h-[10%]">
            <h1 className="xsm:text-sm">Explore by categories</h1>
          </div>
          <div className="h-[90%] w-full bg-gray-300"></div>
        </div>
        {/* posters */}
        <div className="h-[30%] xxsm:h-[50%] sm:h-[70%] md:h-[90%] w-full p-2">
          <div className="h-full w-full bg-green-200"></div>
        </div>
        {/* top rated */}
        {/* <div className="relative h-[80%] w-full bg-pink-200"> */}
          <h1 className="h-[10%] w-full xsm:text-sm p-2">Top Rated</h1>
          <div className=" w-full lg:aspect-[3/1] xxsm:aspect-[8/6] xsm:aspect-[1/1] p-2 flex gap-2 overflow-x-auto">
            <div className="h-[90%] aspect-[1/2] p-1 rounded-lg bg-pink-100 shadow-lg hover:shadow-xl transition-shadow duration-300 shrink-0">
              <div className="h-[50%] aspect-[1/1] w-full rounded-3xl bg-pink-100"></div>
              <article className="relative flex flex-col gap-2 p-2 h-[40%] w-full overflow-hidden">
                <p className="break-words xsm:text-sm w-full">
                  bamboo cocoon sleeping pod swaddle for baby
                </p>
                <p className="w-full">Rs. 1,500</p>
              </article>
            </div>
          </div>
          {/* <button className="absolute bottom-2 left-1/2 transform -translate-x-1/2 h-[40px] w-[98px] rounded-md shadow-black bg-blue-300 text-sm">
            Shop now
          </button> */}
        {/* </div> */}

        {/* blog */}
        <div className="h-[60%] xxsm:h-[90%] sm:h-[120%] md:h-[150%] w-full gap-2 p-2">
          <div className="h-[10%]">
            <h1 className="xsm:text-sm">Blog posts</h1>
          </div>
          <div className="h-[90%] w-full bg-gray-300 grid grid-cols-[2fr_1fr] gap-0.5 p-1 rounded-md">
            <div className="bg-red-100 grid grid-rows-2 gap-0.5">
              <div className="bg-blue-300"></div>
              <div className="grid grid-cols-2 gap-0.5">
                <div className="bg-red-400"></div>
                <div className="bg-pink-400"></div>
              </div>
            </div>
            <div className="bg-blue-100 grid grid-rows-2 gap-0.5">
              <div className="bg-yellow-200"></div>
              <div className="bg-pink-200"></div>
            </div>
          </div>
        </div>
      <Footer/>

      </main>
    </div>
  );
};

export default Homepage;
