import React, { useState } from 'react'
import Footer from '../Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { skillSwapSuccess } from '../../../Redux/Feature/skillSwap';
import {motion} from 'framer-motion'
import Loader from '../Layout/Loader'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const productClick =(id)=>{
   navigate(`/details/${id}`)
  }
  
  const {data:skills,isLoading,error} = useQuery({
    queryKey:["skills"],
    queryFn:async ()=>{
      const {data} = await axiosInstance.get("/user/getswap?limit=4")
      // dispatch(skillSwapSuccess(data))
      return data 
    },
    
  })
  
  // console.log(skills);
  // console.log(error);

  if(isLoading){
    return <div className='h-screen flex justify-center items-center '><Loader /></div>
  }
   
  return (
    <div >      
 <div className="bg-[#EFF9FE] w-full py-14 px-6 md:px-16 lg:px-32 xl:px-64 flex flex-col lg:flex-row items-center justify-center gap-10">
  
  {/* Text Section */}
  <div className="max-w-lg text-center lg:text-left">
    <h1 className="text-3xl md:text-4xl font-anekmalayalam font-semibold">
      Swap Skills, Grow Together
    </h1>
    <p className="text-md text-[#6a6969] mt-6">
      SkillBridge is the bridge where exchanging skills and talents becomes easy.  
      Swap your skills, find what you are looking for. It's all free, you just "pay" with your time.
    </p>
  </div>
  <img 
    className="h-52 md:h-72 lg:h-[350px] w-auto object-contain" 
    src="home.png" 
    alt="SkillBridge Home"
  />
</div>

      
      {/* {products} */}
      <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 1.3, ease: "easeInOut" }} 
    >
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-4 mt-16 gap-8">
          {skills?.data.map((item, index) => (
            <motion.div
              key={index}
              onClick={() => productClick(item._id)}
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, delay: index * 0.2 }} 
              whileHover={{ scale: 1.05, y: -5 }} 
              className="group flex flex-col h-[380px] w-[280px] shadow-xl rounded-sm mb-44 overflow-hidden cursor-pointer"
            >
              <motion.img
                className="h-[160px] object-cover rounded-t-sm w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                src={item.offeredImage || "sample.png"}
                alt={item.offeredTitle}
              />
              <div className="p-4">
                <h1 className="text-md hover:text-[#6d28d2] h-[60px] overflow-hidden">
                  {item.offeredTitle}
                </h1>
                <h1 className="bg-[#F8F8F9] text-sm text-gray-500 mt-4 py-1 text-center">
                  {item.offeredCategory?.toUpperCase()}
                </h1>
                <motion.button
                  className="border border-[#6d28d2] w-full text-[#6d28d2] hover:text-white hover:bg-[#6d28d2] hover:duration-300 
                  hover:ease-in mt-8 text-xs px-10 py-2 rounded-l-3xl rounded-r-3xl"
                >
                  VIEW DETAILS
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>

      {/* {text} */}
      <div className="w-auto h-auto text-gray-500 text-center flex flex-col justify-center mb-28 px-4">
        <h1 className="font-medium text-xl">"You are wanted"</h1>
        <p className="mt-2 w-1/2 text-center mx-auto">
          Is your hobby sports, music, cooking, or handicrafts?
          Whatever you enjoy doing, share it with others by registering as a member
          and publishing your skills.
        </p>
      </div>
      
      {/* Project List */}
      <div className="relative flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between px-8 lg:px-20 py-16 w-[70%] mx-auto  mb-20 ">
      <div className="absolute left-0 lg:left-16 top-10 w-96 h-96 bg-blue-200 rounded-full opacity-50 "></div>
      <div className="relative bg-[#0F1C39] text-white p-6 rounded-xl w-[300px] shadow-lg z-10 left-6 top-3">
        <h2 className="flex items-center justify-between text-lg font-semibold mb-4">
          <span>All Skills</span>
          <span className="text-xl cursor-pointer">+</span>
        </h2>
        <ul className="space-y-2">
          <li className="text-gray-400">Language Learning</li>
          <li className="text-gray-400"> Digital Marketing</li>
          <li className="flex items-center gap-2">
            <span className="text-blue-500">📁</span>  Graphic Design
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-500">📁</span> Software Development
          </li>
          <li className="text-gray-400">Google Ads</li>
          <li className="text-gray-400">Data Science </li>
          <li className="text-gray-400">Cybersecurity</li>
        </ul>

        <img className="absolute -left-16 top-4 w-14 h-14 rounded-full  object-cover" src="land3.jpg" alt="Profile" />
        <img className="absolute -left-16 bottom-8 w-14 h-14 rounded-full object-cover" src="land2.jpg" alt="Profile" />
        <img className="absolute -right-16 top-4 w-14 h-14 rounded-full object-cover" src="land4.jpg" alt="Profile" />
        <img className="absolute -right-14 bottom-8 w-14 h-14 rounded-full object-cover" src="land1.jpg" alt="Profile" />
      </div>

      <div className="max-w-lg text-center lg:text-left mt-12 lg:mt-0 ">
        <h1 className="text-3xl font-bold text-gray-900">
        Skill-sharing made simple - swap what you know, gain what you need, and level up!</h1>
        <p className="text-gray-600 mt-4">
          
          In SkillBridge , you can   exchanging skills, knowledge, or expertise with others.
           Instead of traditional learning methods, where you pay for a course or coaching,
           skill-swapping allows individuals to trade what they already know in exchange for learning something new.
        </p>
      </div>
    </div>

    </div>
  );
}

 export default Home 


