import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ApparelColorPicker = ({ imageUrl }) => {
  const [selectedColor, setSelectedColor] = useState("#ff0000");
  const location = useLocation();
  const product = location.state?.pro; // Extract the product from the state
  console.log(product);

  // Function to handle color change from the color picker
  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Container with the product image and color overlay */}
      <div className="relative w-full max-w-[400px] h-auto">
        {/* Color overlay for shirt only */}
        <div
          className="absolute top-0 left-0 w-full h-full z-10"
          style={{
            backgroundColor: selectedColor,
            mixBlendMode: "color", // Apply color blending
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)', // Adjust to shirt area
          }}
        ></div>

        {/* Product Image */}
        <img
          src={`data:image/png;base64,${product.images[0]}`}
          alt="Apparel"
          className="relative w-full h-auto z-0" // Ensure the image is beneath the overlay
        />
      </div>

      {/* Color Picker */}
      <input
        type="color"
        value={selectedColor}
        onChange={handleColorChange}
        className="mt-4 w-16 h-16 p-0 border-0 cursor-pointer"
      />

      {/* Predefined Color Buttons */}
      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => setSelectedColor("#ff0000")}
          className="w-10 h-10 rounded-full bg-red-500 hover:ring-2 ring-red-300"
        ></button>
        <button
          onClick={() => setSelectedColor("#00ff00")}
          className="w-10 h-10 rounded-full bg-green-500 hover:ring-2 ring-green-300"
        ></button>
        <button
          onClick={() => setSelectedColor("#0000ff")}
          className="w-10 h-10 rounded-full bg-blue-500 hover:ring-2 ring-blue-300"
        ></button>
      </div>
    </div>
  );
};

export default ApparelColorPicker;
