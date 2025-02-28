import React, { useState } from 'react'
import Nav from '../Navbar/Nav'
import Footer from '../Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { skillSwapSuccess } from '../../../Redux/Feature/skillSwap';
import Loader from '../Layout/Loader';

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
  
  console.log(skills);
  console.log(error);

  if(isLoading){
    return <div className='h-screen flex justify-center items-center '><Loader /></div>
  }
   
  return (
    <div >      
      <div className="bg-[#EFF9FE]  w-full wmt-[72px] h-[50%] py-14 px-64 flex  justify-center gap-5 ">
        <div>
          <h1 className="text-3xl font-anekmalayalam font-semibold pt-28 text-center " >
            Swap Skills, Grow Together
          </h1>
          <div>
            {/* <h2 className="text-md text-[#6a6969] mt-6 text-center">Do what you love for people who love what you do!</h2> */}
            <p className="text-md text-[#6a6969] mt-6 text-center">
              SkillBridge is the bridge where exchanging skills and talents
              becomes easy.Swap your skills, find what you are looking for.It's
              all free, you just "pay" with your time.
            </p>
          </div>
        </div>

        <img className="h-[400px] " src="home.png" alt="home.png" />
      </div>
      
      {/* {products} */}
      <div className="flex justify-center ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4   mx-4 mt-16 gap-8   ">
          {skills?.data.map((item,index)=>(

       
          <div onClick={()=>productClick(item._id)} key={index}
           className="group flex flex-col h-[400px] w-[280px] shadow-xl rounded-sm mb-44 overflow-hidden cursor-pointer">
            <img
              className="h-[160px] object-cover rounded-t-sm w-full transition-transform duration-300 ease-in-out group-hover:scale-110 "
              src={item.offeredImage || "sample.png"} />
            <div className=' p-4 ' >
              <h1 className="text-md  hover:text-[#6d28d2] h-[78px] overflow-hidden">{item.offeredTitle}</h1>
              <h1 className='bg-[#F8F8F9] text-sm text-gray-500 mt-4 py-1 text-center'>{item.offeredCategory?.toUpperCase()}</h1>
              <button className='border border-[#6d28d2] w-full text-[#6d28d2] hover:text-white hover:bg-[#6d28d2] hover:duration-300 
               hover:ease-in mt-8 text-xs px-10 py-2 rounded-l-3xl rounded-r-3xl'>VIEW DETAILS</button>
            </div>
          </div>
             ))}

        </div>
      </div>

      {/* {text} */}
      <div className="w-auto h-auto text-gray-500 text-center flex flex-col justify-center mb-28 px-4">
        <h1 className="font-medium text-xl">"You are wanted"</h1>
        <p className="mt-2 w-1/2 text-center mx-auto">
          Is your hobby sports, music, cooking, or handicrafts?
          Whatever you enjoy doing, share it with others by registering as a member
          and publishing your skills.
        </p>
      </div>

    </div>
  );
}

 export default Home 


