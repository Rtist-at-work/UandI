import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { MdCancel, MdDelete, MdEdit } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"; // Importing arrow icons

const PosterBanner = () => {
  const URI = "http://localhost:5000";

  const [imageUpload, setImageUpload] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [serverImages, setServerImages] = useState([]);
  const [imageId,setImageId] = useState([]);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const imageRef = useRef(null);

  // Fetch posters from server
  useEffect(() => {
    const getPoster = async () => {
      try {
        const response = await axios.get(`${URI}/banners/getposter`);
        if (response.status === 200 || response.status === 201) {
          const posters = response.data.banner;
          const fetchedImages = posters.flatMap((poster) => poster.images);
          const fetchedIds = posters.flatMap((poster) => poster._id);
          setServerImages(fetchedImages);
          setImageId(fetchedIds);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getPoster();
  }, []);

  // Handle image display
  const handleImageDisplay = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          const aspectRatio = img.width / img.height;
          if (aspectRatio.toFixed(2) === (16 / 9).toFixed(2)) {
            setUploadedImages((prevImages) => [...prevImages, file]);
            setPreviewImages((prevPreviews) => [...prevPreviews, reader.result]);
          } else {
            alert("Please upload images with a 16:9 aspect ratio.");
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle deleting uploaded images
  const handleDelete = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => index !== i);
    const updatedPreviews = previewImages.filter((_, i) => index !== i);
    setUploadedImages(updatedImages);
    setPreviewImages(updatedPreviews);
  };

  // Handle form submission for uploaded images
  const handleFormSubmission = async () => {
    const formdata = [];
    const updatedImages = [...serverImages];
  
    // Function to read image as Base64
    const readImageAsBase64 = (image) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Img = reader.result;
          const splitImg = base64Img.split(','); // Get the base64 part after the comma
          resolve(splitImg[1]); // Resolve with the base64 part
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(image);
      });
    };
  
    try {
      // Wait for all images to be processed
      const base64Images = await Promise.all(uploadedImages.map(readImageAsBase64));
  
      // Update formdata and updatedImages arrays
      base64Images.forEach((img) => {
        formdata.push(img);
        updatedImages.push(img);
      });
  
      console.log(formdata); // Now this will contain all the base64 strings
  
      // Send the formdata to the server
      const response = await axios.post(`${URI}/banners/poster`, {
        images: formdata, // Send the base64 images array
      });
  
      if (response.status === 200 || response.status === 201) {
        setUploadedImages([]);
        setPreviewImages([]);
        alert("Banner Added Successfully");
        setServerImages(updatedImages);
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  

  // Handle edit of uploaded images
  const handleEdit = async (index) => {
    const newImageFile = await new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (event) => {
        const file = event.target.files[0];
        resolve(file);
      };
      input.click();
    });
  
    if (newImageFile) {
      // Function to convert the file to base64 using FileReader
      const updatedImages = (newImageFile) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result); // Return the base64 string
          };
          reader.onerror = reject; // Handle errors
          reader.readAsDataURL(newImageFile); // Start reading the file
        });
      };
  
      try {
        const base64Image = await updatedImages(newImageFile); // Await the result of the base64 conversion
        const iq = base64Image.split(',');
  
        const editId = imageId[index];
  
        const response = await axios.put(`${URI}/banners/edit/${editId}`, {
          'image' : iq[1]
        });
        if (response.status === 200) {
        alert("Banner Edited Successfully");
        const updatedServerImages = serverImages.map((img, i) =>
          i === index ? iq[1] : img
        );
        console.log(updatedServerImages)
        setServerImages(updatedServerImages);
        }
      } catch (err) {
        console.error("Error during image update:", err);
      }
    }
  };
  
  

  // Handle delete request for server images
  const handleServerImageDelete = async (index) => {
    const deleteposter = async()=>{
      const posterId = imageId[index];
      try{
        const response = await axios.delete(`${URI}/banners/delete/${posterId}`)
        if(response.status === 200 || response.status===201){
          alert(response.data.message)
          const updatedServerImages = [...serverImages];
          updatedServerImages.splice(index,1);
          setServerImages(updatedServerImages);
        }
      }
      catch(err){
        alert(err.data.message)
      }
    }
    deleteposter();
  };

  return (
    <div className="h-[30%] xxsm:h-[50%] sm:h-[70%] md:h-[90%] w-full mt-6">
      <div className="flex justify-between p-2 items-center">
        <label>Poster</label>
        <button
          className="max-h-max min-w-max p-2 rounded border-2 border-gray-200 bg-blue-500 text-white text-sm"
          onClick={() => setImageUpload(!imageUpload)}
        >
          Add poster
        </button>
      </div>

      {/* Slideshow Container */}
      <div className="p-2 h-full w-full flex flex-col items-center">
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
          {/* Edit and Delete Buttons */}
          {serverImages.length > 0 && (
            <div className="absolute top-2 right-2 flex gap-2">
              <MdEdit
                className="text-blue-500 cursor-pointer"
                onClick={() => handleEdit(slideshowIndex)}
              />
              <MdDelete
                className="text-red-500 cursor-pointer"
                onClick={() => handleServerImageDelete(slideshowIndex)}
              />
            </div>
          )}
          {/* Arrow Buttons */}
          <IoIosArrowBack
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer text-3xl"
            onClick={() => setSlideshowIndex((prev) => (prev === 0 ? serverImages.length - 1 : prev - 1))}
          />
          <IoIosArrowForward
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer text-3xl"
            onClick={() => setSlideshowIndex((prev) => (prev === serverImages.length - 1 ? 0 : prev + 1))}
          />
        </div>
      </div>

      {/* Image Upload Modal */}
      {imageUpload && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
          <div className="relative max-h-max w-[90%] flex flex-col gap-2 border-2 p-4 border-blue-500 bg-white rounded">
            <MdCancel
              className="absolute text-red-500 right-2 top-2 text-lg cursor-pointer"
              onClick={() => setImageUpload(false)}
            />
            <label className="text-sm">Add Image</label>
            <div className="relative max-h-max w-full border-2 border-gray-300 rounded p-2 flex items-center gap-2">
              <input
                type="file"
                ref={imageRef}
                multiple
                className="opacity-0 ml-hidebuttons"
                onChange={handleImageDisplay}
              />
              <FiUpload
                className="h-24 w-[10%] cursor-pointer"
                onClick={() => imageRef.current.click()}
              />
              <div className="relative h-full w-[90%] overflow-auto flex items-center gap-1">
                {previewImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative max-h-max w-16 flex-shrink-0 flex flex-col gap-1"
                  >
                    <img
                      src={image}
                      className="h-16 w-16 rounded border-2 border-gray-500 p-0.5"
                      alt={`uploaded-${index}`}
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
              onClick={handleFormSubmission}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosterBanner;
