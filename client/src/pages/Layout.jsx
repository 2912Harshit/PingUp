import { Menu, Sidebar } from 'lucide-react'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { assets, dummyUserData } from '../assets/assets'
import Loading from '../components/Loading'
import SIdebar from '../components/SIdebar'


const Layout = () => {

  const user=dummyUserData;
  const [sidebarOpen,setSidebarOpen] = useState(false);


  return user ? (
      <div className='w-full flex h-screen'>
      <SIdebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}></SIdebar>
      <div className='flex-1 bg-slate-50'>
        <Outlet></Outlet>
      </div>
      {
      sidebarOpen ?
      <X onClick={()=>setSidebarOpen(false)} className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden'></X>
      :
      <Menu onClick={()=>setSidebarOpen(true)} className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden'></Menu>
      }
      
      {/* <h1>Layout</h1> */}
    </div>
  ): (
    <Loading></Loading>
  )
}

export default Layout
