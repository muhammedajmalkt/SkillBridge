import React, { useEffect, useRef, useState } from 'react'
import { data, Link, NavLink, useNavigate } from 'react-router-dom'
import Signup from '../Registraion/Signup'
import Login from '../Registraion/Login'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { loginSuccess, logoutSuccess } from '../../../Redux/Feature/authSlice'
import axiosInstance from '../../../api/axiosInstance'
import toast  from 'react-hot-toast'
import { useLogout } from '../../../hooks/useAuth'



const Nav = () => {

  const [showSignup, setShowSignup] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [dpClick, setDpClick] = useState(false)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  // console.log(user);
  const dispatch = useDispatch()
  const naviagte = useNavigate()
  const queryClient = useQueryClient()
  const dropdownRef = useRef(null)


const handleMouseEnter = () => setDpClick(true);
const handleMouseLeave = () => setDpClick(false)
   // Close dropdown when clicking outside
   useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDpClick(false);
        }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
}, []);

  const handleShowSignup = () => {
    setShowLogin(false)
    setShowSignup(true)
  }
  const handleShowLogin = () => {
    setShowSignup(false)
    setShowLogin(true)
  }
  
  const {data:logedUser,isLoading} = useQuery({
    queryKey:["fetchUser",user?._id],
    queryFn:async ()=>{
      const {data} = await axiosInstance.get ("/user/userin")
      dispatch(loginSuccess(data))
      return data
    },
    enabled: !!isAuthenticated
  })
  // console.log(logedUser,"=====logeduser");
  // console.log(user,"=====");
 
  
  const { mutate: logout, } = useLogout();
  const handleLogout = () => {
    logout(null, {
      onSuccess: (data) => { 
        dispatch(logoutSuccess(data))
        console.log(data);
        toast.success(data?.message ||"Logged Out" , {
          position: "top-right",
        });
        naviagte("/")
        queryClient.clear()
      },
      onError:(err) => {
        console.log(err.response?.data);
        toast.error(err.response?.data?.message, {
          position: "top-right",
          autoClose: 3000,
        });
      },
    });
  };

  
  return (
    <div>
      {showSignup && <Signup setShowLogin={setShowLogin} setShowSignup={setShowSignup} />}
      {showLogin && <Login setShowSignup={setShowSignup} setShowLogin={setShowLogin} />}
      <nav className=" shadow-md fdixed top-0 w-full z-50 bg-white">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-[#181818]">
            Ski<span className='text-[#6d28d2] font-bold   '>⇅</span>Bridge</a>

          <div className="hidden md:flex space-x-6 text-sm">
            <Link to="/" className="text-gray-600 hover:text-[#6d28d2] ">Home</Link>
            <Link to="/swapskill" className="text-gray-600  hover:text-[#6d28d2] ">Discover</Link>
            <Link  to="/swap" className="text-gray-600  hover:text-[#6d28d2] ">Swap</Link>
            <Link to="/group" className="text-gray-600   hover:text-[#6d28d2] ">Peer Group</Link>
            <Link to="/favorite" className="text-gray-600    hover:text-[#6d28d2] ">Favorites</Link>
            <Link to="/notification" className="text-gray-600   hover:text-[#6d28d2] ">Notifications</Link>
          </div>

          {/* Auth */}
          {!isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-[#6d28d2] border border-[#6d28d2] text-white text-[14px]  rounded-md hover:bg-[#892de1]" onClick={handleShowSignup}>Sign Up</button>
              <button className="px-4 py-2 border border-[#6d28d2] text-[14px]  text-[#6d28d2] rounded-md hover:bg-gray-200" onClick={handleShowLogin}>Log In</button>
            </div>) :

            <div>
              <img className='h-9 w-9 rounded-full object-cover cursor-pointer'
                src={user?.image || "dp.jpg"} alt='profile pic'
                onMouseEnter={handleMouseEnter}  onClick={() => setDpClick(!dpClick)}
              />

              {/* {dropdwon dp} */}
              {dpClick &&
                <div className='absolute  right-4 top-[67px]   rounded-md bg-white shadow-2xl '
                onMouseEnter={handleMouseEnter}   onMouseLeave={handleMouseLeave} > 
                  <Link  to="/profile">
                  <div className='flex justify-center  items-center p-3  cursor-pointer hover:bg-gray-200 '>
                    <img className='h-12 w-12 object-cover rounded-full cursor-pointer'
                      src={user?.image || "dp.jpg"} />

                      <div className='flex flex-col ml-4'>
                       <p className='w-[200px] '>{user?.name }</p>
                       <p className='w-[200px] '>{user?.email }</p>
                      </div>
                  </div>
                  </Link>

                  <button className=' border-t  w-full p-3 bg-white rounded-b-md hover:bg-red-500 hover:text-white'
                  onClick={handleLogout} >Log out</button>

                </div>}
            </div>}

        </div>
      </nav>
    </div>)
}

export default Nav