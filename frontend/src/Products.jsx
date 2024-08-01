import React, { useState } from 'react'
import { TbBookUpload } from "react-icons/tb";
import { useRef } from 'react';

const Products = () => {

  const uploadRef = useRef(null);
  const [name,setName] = useState('');
  const [price,setPrice] = useState('');
  const [category,setCategory] = useState('');
  const [description,setDescription] = useState('');
  const [images,setImages] = useState([]);

  const handleChange = (e)=>{
    const id = e.target.id;
    if (id === 'name') {
      setName(e.target.value);
    } else if (id === 'price') {
      setPrice(e.target.value);
    } else if (id === 'category') {
      setCategory(e.target.value);
    } else if (id === 'description') {
      setDescription(e.target.value);
    }
    else if (id === 'category') {
      setCategory(e.target.value);
    }
  }

  const handleButtonClick =(e)=>{
    console.log("button clciked")
    uploadRef.current.click(); 
  }

  const handleImageUpload = (e)=>{
    console.log(e);
    let files = Array.from(e.target.files);
    if (files.length>0) {
      const image = files.map(file=>URL.createObjectURL(file))
      console.log(image);
      setImages([...images, ...image]);
      console.log(images.length)
    }

    
    
  }
  return (
    <div className='relative p-8  h-[90%] w-[100%]'>
      <header className='text-xl font-bold h-[10%] w-[100%] '>
        ADD PRODUCT
      </header>
      <main className='ml-4 h-[90%] w-[100%] '>
        <form className='flex flex-col space-y-2  h-[100%] w-[80%] '>
          <label htmlFor='name'> NAME </label>
          <input type='text' id='name' name='Name' placeholder='Product Name' className='h-[10%] rounded' onChange={(e)=>{handleChange(e)}} value={name}/>
          <label htmlFor='price'> PRICE </label>
          <input type='number' id='price' name='Price' placeholder='Price' className='h-[10%] rounded' onChange={(e)=>{handleChange(e)}} value={price}/>
          <label htmlFor='category' value={category}> CATEGORY </label>
          <select id='category' name='Category' className='h-[10%] rounded' onChange={(e)=>{handleChange(e)}}>
            <option value={'Select Category'}>
              Select Category
            </option>
            <option value={'Select Category 1'}>
              Select Category 1
            </option>
            <option value={'Select Category 2'}>
              Select Category 2
            </option>
          </select>
          <label htmlFor='description'> DESCRIPTION </label>
          <textarea id='description' name='Description' placeholder='Description' 
          className=' h-[30%] rounded overflow-y-auto' onChange={(e)=>{handleChange(e)}} value={description}/>
          <label htmlFor='image'> image </label>
          <div className='flex p-2  h-[20%] w-full border-2 border-black-800 bg-pink-800  rounded '>
            <input type='file' multiple id='image' name='Image' ref={uploadRef} className={`invisible ? 'hidden' : '' ml-hidebuttons`} onChange={(e)=>{handleImageUpload(e)}} 
            />
            <TbBookUpload  className=' h-[100%] w-[10%] mt-0 cursor-pointer'   onClick={(e)=>handleButtonClick(e)} />
            <div className='flex h-[100%] w-[90%] mt-0 overflow-x-auto overflow-y-hidden'>
              {images.length > 0 ? images.map((image, index) => (
                  <img key={index} src={image} alt={`Uploaded ${index}`} className=' h-[100%] w-[10%] rounded ml-2 mb-2' />
                )) : <p>No images uploaded</p>}  
            </div>         
          </div>
          
          <button className='h-[10%] w-[20%] font-medium rounded border-2  ml-[40%] mb-0 '>SAVE</button>

        </form>
      </main>
    </div>
  )
}

export default Products
