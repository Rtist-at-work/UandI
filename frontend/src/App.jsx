import { useRef, useState, useEffect } from 'react'
import './App.css'
// import PostsList from './ProductsList'
import Header from './Header'
import Sidebar from './Sidebar'
import Homepage from './Homepage';
import Products from './Products';
import Categories from './Categories';
import Banners from './Banners';
import Orderlist from './Orderlist';
import { CgOverflow } from 'react-icons/cg';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [navId,setNavId] =useState(null);

  const handlemenubartoggle = ()=>{
    console.log(isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen)

  }

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {

    // document.addEventListener('mousedown', handleClickOutside);
    // // Cleanup function
    // return () => {
    //   document.removeEventListener('mousedown', handleClickOutside);
    // };
  }, []); 

  const handlesidebarnav = (e)=>{
    const navid = e.target.id
    setNavId(navid);
  }

  return (
    <>
      <div className='relative bg-red-500 w-screen  h-screen '>
        <div ref={sidebarRef} className={`absolute h-screen  sm:w-[30%] md:w-[35%] lg:w-[20%] xl:w-[15%] bg-custom-gray transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} translation-all duration-1000`}>
          <Sidebar 
          isSidebarOpen={isSidebarOpen}
          ref={sidebarRef}
          handlesidebarnav={handlesidebarnav}
          />      
        </div>
        <div className={`absolute bg-blue-500 h-full w-full  ${isSidebarOpen ? ' sm:ml-[30%] md:ml-[35%] lg:ml-[20%] xl:ml-[15%]  sm:w-[70%] md:w-[65%] lg:w-[80%] xl:w-[85%]': 'w-full'} transition-all duration-1000 `}>
            <Header
            handlemenubartoggle={handlemenubartoggle}
            isSidebarOpen={isSidebarOpen}
            /> 
            {navId === "home" ? <Homepage /> : navId === "products" ? <Products /> : navId === "banners" ? <Banners/> :navId === "orderlist" ? <Orderlist/> : navId === "categories" ? <Categories/> : <Homepage/>} 
        </div>    
        
      </div>
      {/* <div>
        <PostsList/>
      </div> */}
        
    </>
  )
}

export default App
