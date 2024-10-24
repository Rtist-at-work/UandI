import axios from "axios";
import React, { useRef, useState } from "react";
import Footer from "../mobile components/Footer";
import { FiUpload } from "react-icons/fi";
import { MdModeEdit, MdCancel, MdDelete } from "react-icons/md";
import ShopByAge from "./ShopByAge";
import PosterBanner from "./PosterBanner";

const AllBanners = (URI) => {
  const uploadRef = useRef();
  const [images, setImages] = useState([]);
  const [imageUpload, setImageUpload] = useState(false);
  const [container1, setContainer1] = useState([]);
  const imageRef_1 = useRef(null);
  const imageRef_2 = useRef(null);

  const handleImageDisplay = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => URL.createObjectURL(file));
      setContainer1((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleDelete = (index) => {
    const updatedContainer1 = container1.filter((_, i) => index !== i);
    setContainer1(updatedContainer1);
  };

  const handleformsubmission = async () => {
    // Form submission logic...
  };

  return (
    <div className="absolute  h-[90%] w-full rounded-md shadow-md  z-20">
      <main className="relative h-[95%] w-[100%] overflow-auto scrollbar-hidden p-2">
      {imageUpload && (
          <div className="absolute h-full w-full flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
            <div className="relative max-h-max w-[70%] flex flex-col gap-2 border-2 p-4 border-blue-500 bg-white rounded">
              <MdCancel
                className="absolute text-red-500 right-2 top-2 text-lg"
                onClick={() => setImageUpload(!imageUpload)}
              />
              <label className="text-sm">Add Image Container 1</label>
              <div className="relative h-32 w-full border-2 border-gray-300 rounded p-2 flex items-center gap-2">
                <input
                  type="file"
                  ref={imageRef_1}
                  multiple
                  className="opacity-0 ml-hidebuttons"
                  onChange={(e) => handleImageDisplay(e)}
                />
                <FiUpload
                  className="sm:w-12 xsm:h-8 sm:h-12 xsm:w-8 cursor-pointer"
                  onClick={() => imageRef_1.current.click()}
                />
                <div className="relative h-full w-[90%] overflow-auto flex items-center gap-1">
                  {container1.length > 0 &&
                    container1.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-16 w-16 flex-shrink-0"
                      >
                        <img
                          src={image}
                          className="h-full w-full rounded border-2 border-gray-500 p-0.5"
                        />
                        <MdDelete
                          className="absolute top-1 right-1 text-red-500 cursor-pointer"
                          onClick={() => handleDelete(index)}
                        />
                      </div>
                    ))}
                </div>
              </div>
              <button
                className="max-h-max p-2 text-sm text-white mx-auto mt-4 w-16 rounded border-2 border-gray-200 bg-blue-500"
                onClick={() => handleformsubmission()}
              >
                Save
              </button>
            </div>
          </div>
        )}
        <form>
          <input
            ref={uploadRef}
            type="file"
            multiple
            onChange={handleImageDisplay}
            className="hidden"
          />
        </form>
        <h1 className="m-2">Main Container</h1>
        <div className="h-[40%] w-full">
          <div className="relative h-[100%] xxsm:h-[60%] sm:h-[80%] md:h-[100%] lg:h-[120%] w-full z-0 p-4 flex">
            <div className="relative h-full w-[70%] overflow-y-auto">
              <div className="h-[75%] w-[75%] bg-blue-200"></div>
              <div className="absolute bottom-0 right-0 h-[50%] w-[50%] bg-green-300"></div>
            </div>
            <div className="absolute right-0 w-[48%] h-[43%] flex items-center justify-center">
              <button
                className="max-h-max min-w-max p-2 rounded border-2 border-gray-200 bg-blue-500 text-white text-sm"
                onClick={() => setImageUpload(!imageUpload)}
              >
                Add Images
              </button>
            </div>
          </div>
        </div>

        
        <ShopByAge />
        <PosterBanner />
      </main>
      <footer className="h-[5%] w-full md:hidden xsm:block">
        <Footer />
      </footer>
    </div>
  );
};

export default AllBanners;
//mmvml
