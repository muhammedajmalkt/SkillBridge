import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import axiosInstance from '../../../api/axiosInstance'
import Loader from '../Layout/Loader'
import { useCreateTransaction } from '../../../hooks/useSwap'
import toast from 'react-hot-toast'
import { NavLink } from 'react-router-dom'

const SwapWith = ({receiverSkill,setRequest}) => {
    const { isAuthenticated } = useSelector((state) => state.auth)
    const [requestBtn,setRequestBtn]=useState(null)
    const [requesterDtl,setRequesterDtl]=useState(null)
    const {mutate:createTransaction,isSuccess}=useCreateTransaction()

    const {data,error,isLoading}=useQuery({
        queryKey:["getAll"],
        queryFn:async () =>{
            const {data} = await axiosInstance.get("/user/get/getSwapByUserId")
            return data
        },
        enabled : !!isAuthenticated
    })
    const skill = data?.data
    // console.log(skill);
    if(isLoading) return <div className='mt-[72px] h-screen flex justify-center items-center '><Loader /></div>

    const  handleClose = () =>{
        setRequest(false)
    }
    const handleSelect = (details)=>{
        setRequestBtn(details._id)
        setRequesterDtl(details)
    }
    const handleSendRequest = ( ) =>{        
        createTransaction(
          {
            requesterSkillId: requesterDtl._id,
            requesterUserId: requesterDtl.userId,
            receiverSkillId: receiverSkill._id,
            receiverUserId: receiverSkill.userId._id,
          },
          {
            onSuccess: (data) => {              
              console.log(data);
              toast.success(data?.message,{
                position: "top-right",
                autoClose: 3000,
              })
              setRequest(false);
            },
            onError: (err) => {
              console.log("API Error:", err?.response.data);
              toast.error(err.response?.data?.message || "An error occurred", {
                position: "top-right",
                autoClose: 3000,
              });
            },
          }
        );
    }
    

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 sm:w-3/5 md:w-1/2 lg:w-1/3 relative">
            <button className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-[#6d28d2] transition z-50" onClick={handleClose} ><IoClose /></button>
         <div className="flex flex-col items-center text-center space-y-2 h-[400px] overflow-scroll px-9  " >
         <h1 className="text-2xl fixed w-1/3 font-bold text-gray-900   bg-white text-center shadow-sm pb-1 z-20 ">Swap with</h1>

        {skill.length > 0 ? skill?.map((skill)=>(
       <div className='relative top-10 w-[100%]'>
       <div className={`flex gap-5 shadow  p-2 rounded focus:bg-[#6c28d26b] cursor-default  ${requestBtn === skill._id ? "bg-[#6c28d247]":" hover:bg-slate-100 "} `} onClick={()=>handleSelect(skill)} >
        <img src={skill?.offeredImage || "sample.png"} alt="image" className='w-20 h-16 bg-gray-500 object-cover' />  
        <div className='text-start '>
           <h1 className="text-sm text-gray-700 line-clamp-2 ">{skill?.offeredTitle}</h1>
           <h1 className='text-xs mt-1 text-gray-500'>{skill?.offeredCategory.toUpperCase() }</h1>
        </div>  
        </div>
        </div>
              
        )):<div className='flex justify-center w-screen  z-50'><p className='mt-10'>No Swap found! <NavLink to="/profile" className="text-blue-600 underline">add</NavLink></p> </div> }

      </div>
   { requestBtn &&  <div className="w-full flex justify-end py- mt-2  ">
         <button className="px-4 py-2 bg-[#6d28d2] text-white font-semibold rounded-lg  hover:bg-[#5a1fb8] transition-all duration-300 shadow-md mr-9
                     active:scale-95" onClick={handleSendRequest} > Send Request
       </button>
        </div>}
    </div>
  </div>
  )
}

export default SwapWith