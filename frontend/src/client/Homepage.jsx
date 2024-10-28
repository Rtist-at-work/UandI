import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

const Homepage = () => {
  const URI = "http://localhost:5000";

  const [categoryList, setCategoryList] = useState();
  const [banner, setBanner] = useState([]); // fetched banners
  const [ageBanner, setAgeBanner] = useState([]);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  const navigate = useNavigate();
  const interval = 3000;

  const [serverImages, setServerImages] = useState([]);

  // Fetch posters from server
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideshowIndex((prevIndex) => (prevIndex + 1) % serverImages.length);
    }, interval);

    return () => clearInterval(timer); // Clear the interval when component unmounts
  }, [serverImages.length, interval]);



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
    const bannerFetch = async () => {
      try {
        const response = await axios.get(`${URI}/banners/fetchage`);
        if (response.status === 200 || response.status === 201) {
          setBanner(response.data.banner);
          setAgeBanner(response.data.banner.slice(0, 5));
        }
      } catch (err) {
        console.log(err);
      }
    };
    bannerFetch();

    const getPoster = async () => {
      try {
        const response = await axios.get(`${URI}/banners/getposter`);
        if (response.status === 200 || response.status === 201) {
          const posters = response.data.banner;
          const fetchedImages = posters.flatMap((poster) => poster.images);
          const fetchedIds = posters.flatMap((poster) => poster._id);
          setServerImages(fetchedImages);
          // setImageId(fetchedIds);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getPoster();
  }, []);

  const handleStyleNav = (c, s) => {
    navigate(`/productpage?categorynav=${c}&stylenav=${s}`);
  };
  console.log(ageBanner);
  return (
    <div className="h-screen w-screen">
      <Header />

      <main className="relative h-[85%] w-full overflow-y-auto overflow-x-hidden scrollbar-hidden">
        <div className="h-6 lg:h-12 w-full flex bg-blue-300 gap-4 px-4 justify-around items-center z-10">
          {categoryList && categoryList.length > 0 ? (
            categoryList.map((category) => (
              <div key={category.category} className="relative group z-30">
                <a className="cursor-pointer text-gray-900">
                  {category.category}
                </a>
                <ul className="absolute left-0 hidden group-hover:block bg-white border z-50 min-w-max transition duration-3000 ease-out hover:ease-in rounded shadow-lg">
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
        <h1 className="w-full h-12 mx-auto m-4">Shop by Age</h1>
        <div className="w-full aspect-[4/1]  flex items-center   ">
          <FaAngleLeft
            className="left-0 z-50 text-2xl w-[2%] cursor-pointer sm:block xsm:hidden"
            onClick={() => {
              // Find the current start index of ageBanner in the main banner array
              const startIndex = banner.indexOf(ageBanner[0]);

              // If the start index is already 0, don't move further
              if (startIndex === 0) return;

              // Calculate the new start index by subtracting 5 (move left)
              const newStartIndex = startIndex - 5 < 0 ? 0 : startIndex - 5;

              // Slice the banner array to get the new set of 5 banners
              setAgeBanner(banner.slice(newStartIndex, newStartIndex + 5));
            }}
          />

          <div className="relative flex gap-2 items-center sm:overflow-hidden xsm:overflow-auto sm:w-[96%] xsm:w-full h-full ">
            {ageBanner &&
              ageBanner.map((bannerItem, index) => {
                return (
                  <div
                    key={index}
                    className="w-[20%] sm:flex xsm:hidden  flex-col gap-2 items-center justify-center aspect-[1/1]"
                  >
                    <img
                      src={`data:image/png;base64,${bannerItem.images[0]}`}
                      className="w-[70%] aspect-[1/1] rounded-full object-cover"
                      alt={`img-${index}`}
                    />
                    <p className="h-[20%] max-w-max ">
                      {bannerItem.age[0] || "Age not available"}
                    </p>
                  </div>
                );
              })}
            {banner &&
              banner.map((bannerItem, index) => {
                return (
                  <div
                    key={index}
                    className="h-full sm:hidden  shrink-0 xsm:flex flex-col items-center justify-center aspect-[1/1] scrollbar-hidden"
                  >
                    <img
                      src={`data:image/png;base64,${bannerItem.images[0]}`}
                      className="h-[70%] aspect-[1/1] rounded-full object-cover"
                      alt={`img-${index}`}
                    />
                    <p className="h-[20%]">
                      {bannerItem.age[0] || "Age not available"}
                    </p>
                  </div>
                );
              })}
          </div>
          <FaChevronRight
            className="left-0 z-50 text-2xl w-[2%] cursor-pointer sm:block xsm:hidden"
            onClick={() => {
              // Find the current start index of ageBanner in the main banner array
              const startIndex = banner.indexOf(ageBanner[0]);

              // Calculate the new start index by adding 5 (move right)
              const newStartIndex =
                startIndex + 5 >= banner.length ? 0 : startIndex + 5;

              // Slice the banner array to get the new set of 5 banners
              setAgeBanner(banner.slice(newStartIndex, newStartIndex + 5));
            }}
          />
        </div>

        {/* categories */}
        <div className="h-[70%] xxsm:h-[80%] sm:h-[90%] md:h-[100%] w-full p-2">
          <div className="h-[10%]">
            <h1 className="xsm:text-sm">Explore by categories</h1>
          </div>
          <div className="h-[90%] w-full bg-gray-300"></div>
        </div>
        {/* posters */}
        <div className="aspect-[16/9] w-full p-2">
        <div className="relative h-full w-full  flex justify-center items-center">
          {serverImages.length > 0 ? (
            <img
              src={`data:image/png;base64,${serverImages[slideshowIndex]}`}
              className="h-full w-full object-cover"
              alt="slideshow"
            />
          ) : (
            <p>No images to display</p>
          )}          
        </div>
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
        <Footer />
      </main>
    </div>
  );
};

export default Homepage;
