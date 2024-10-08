import React from 'react';
import MonthlyGraph from './homepage components/MonthlyGraph';
import FourTile from './homepage components/FourTile';
import TotalRevenue from './homepage components/TotalRevenue';
import Footer from './mobile components/Footer';

const Homepage = () => {
  return (
    <div className='absolute  h-[93%] w-full  bg-white-800 '>
      <main className='grid xsm:grid-rows-3 p-1 overflow-y-auto h-[95%] w-[100%]'>
        <FourTile/>
        <TotalRevenue/>
        <MonthlyGraph/>
      </main>      
      <footer className='relative bottom-0gap-2 p-2  h-[5%] bg-gray-100 lg:hidden '>
        <Footer/>
          
      </footer>
    </div>
  );
};

export default Homepage;
