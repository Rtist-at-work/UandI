import React from 'react'

const Homepage = () => {
  return (
    <div className='relative h-[90%] w-full p-4 bg-white-800 overflow-y-auto  '>
      <header className='h-fit text-xl bg-green-800'>
        DASHBOARD
      </header>
      <main className='h-[60%] w-full  p-2 flex'>
        <div className='w-[50%] bg-green-800 rounded-md'>
          
        </div>
        <div className='w-[50%] ml-2 bg-green-800 rounded-md'>

        </div>
      </main>
      <footer className='h-[35%] p-2 flex bg-yellow-800'>
        <div className='h-full w-full bg-green-800 rounded-md'></div>
      </footer>
      


    </div>
  )
}

export default Homepage
