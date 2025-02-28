import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import axiosInstance from '../../../api/axiosInstance'
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import Loader from '../Layout/Loader';
import { useDeleteSwap } from '../../../hooks/useSwap';
import toast  from 'react-hot-toast'
import { useSelector } from 'react-redux';



const AllSkills = () => {
    const [threeDot,setThreeDot]=useState(null)
    const navigate = useNavigate()
    const {mutate:deleteSwap} =useDeleteSwap()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const queryClient = useQueryClient()

    const {data,isloading,error,isLoading}=useQuery({
        queryKey:["getAll"],
        queryFn:async () =>{
            const {data} = await axiosInstance.get("/user/get/getSwapByUserId")
            return data
        },
        enabled : !!isAuthenticated
    })
  const skill = data?.data
  console.log(data);
  console.log(error);
    
    const handleClick = (id) =>{
        navigate(`/details/${id}`)
    }
    
    const handleThreeDot = (id) =>{
        setThreeDot((prevId)=> prevId === id ? null : id)
    }


  const handleDelete = (id)=>{
    console.log(id);
    deleteSwap(id,{
        onSuccess:(data)=>{
              toast.success(data?.message, {
                position: "top-right",
                 autoClose: 3000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: false,
                 draggable: true,
                  });
               queryClient.invalidateQueries(["getAll"])
                          
        },
        onError :(err)=>{
            console.log("API Error:", err?.response.data);
            toast.error(err.response?.data?.message || "An error occurred", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
             });

        }
    })
  }  
  
  if(isLoading) return <div className='mt-[72px] h-screen flex justify-center items-center '><Loader /></div>

    

  return (
    <div className='border border-gray-600 h-full w-[800px]'>
            <div className='border-b  border-gray-600  h-[92px] py-4 text-center'>
             <h1 className='text-20px font-semibold' > </h1>
             <h3 className='text-sm'>Swap Added to Your Profile!</h3>
            </div>
            
            {skill?.map((skill)=>(

                <div className='flex border p-3 m-4 gap-8 rounded ' >
                   <img src={skill?.offeredImage} alt='pic' className='w-28 rounded bg-slate-500 cursor-pointer object-cover' onClick={()=>handleClick(skill._id)}/> 
                 <div>
                  <div className='flex justify-between '>
                     <h1 className='font-semibold h-12 overflow-hidden cursor-pointer' onClick={()=>handleClick(skill._id)}>{skill?.offeredTitle}</h1>
                     <span className='cursor-pointer ml-48' onClick={()=>handleThreeDot(skill?._id)}><BsThreeDotsVertical/></span>
                 </div>   
                            { threeDot === skill?._id &&
                        <div className='absolute right-96 -mt-12 bg-slate-100 w-16 py-2 border text-xs rounded shadow-md text-gray-700 '>
                            <h1 className="border-b border-b-gray-200 cursor-pointer hover:bg-slate-200 px-2 pb-1 ">Edit</h1>
                            <h1 className='cursor-pointer hover:bg-slate-200 px-2 pt-1' onClick={()=>handleDelete(skill?._id)}>Delete</h1>
                        </div>}
                <h1 className='text-gray-600 text-sm'>{skill?.offeredCategory}</h1>
                
                </div>

            </div>
                ))}
             
             

   </div>
)
}

export default AllSkills